import { HostListener, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { init, ECharts } from 'echarts';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { MeasureType } from '../shared/api/enums/measure-type';
import { Measure } from '../shared/api/models/measure';
import { Room } from '../shared/api/models/room';
import { NetatmoService } from '../shared/api/servives/netatmo.service';
import { MEASURE_TYPE_BY_MODULE_TYPE } from '../shared/constants/measure-type-by-module-type';
import { Interval } from '../shared/enums/interval';
import { ModuleWithRoom } from '../shared/models/module-with-room';
import { getInterval } from '../shared/utils/date-interval';
import { dateToUnixTimestamp } from '../shared/utils/date-to-unix-timestamp';
import { hasRoom } from '../shared/utils/has-room';

type DateSetSource = { timestamp: string; temperature: number; name: string; roomId: string };

// interface RoomWithModule extends Room {
//   modules: Module[];
// }

@Component({
  standalone: true,
  imports: [],
  selector: 'net-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  @ViewChild('chart', { static: true }) chartDiv!: ElementRef;

  private chart!: ECharts;
  private interval = getInterval(Interval.Day);

  constructor(private netamoService: NetatmoService) {}

  ngOnInit(): void {
    this.netamoService
      .getHomesData()
      .pipe(
        map(({ body }) => body.homes[0]),
        tap(({ rooms }) => this.initChart(rooms)),
        switchMap(({ modules }) =>
          forkJoin(
            modules
              .filter(hasRoom)
              .filter((module) => MEASURE_TYPE_BY_MODULE_TYPE[module.type].includes(MeasureType.Temperature))
              .map((module) => this.getModuleMeasureDataSetSource(module))
          )
        ),
        map((dataSetSources) => dataSetSources.flat())
      )
      .subscribe((dataSetSource) => {
        this.updateChart(dataSetSource);
      });
  }

  private getModuleMeasureDataSetSource({ id, bridge, name, room_id }: ModuleWithRoom): Observable<DateSetSource[]> {
    return this.netamoService
      .getMeasure({
        device_id: bridge ?? id,
        module_id: id,
        type: [MeasureType.Temperature],
        scale: this.interval.scale,
        date_begin: dateToUnixTimestamp(this.interval.begin),
        date_end: dateToUnixTimestamp(this.interval.end),
      })
      .pipe(map(({ body }) => this.toDataSetSource(name, room_id, body)));
  }

  // private toRooms({ homes }: HomesDataResponse): RoomWithModule[] {
  //   const home = homes[0];
  //   const modules: { [id: string]: Module } = home.modules.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
  //   return home.rooms.map((room) => ({ ...room, modules: room.module_ids.map((id) => modules[id]) }));
  // }

  private toDataSetSource(name: string, roomId: string, measures: Measure[]): DateSetSource[] {
    return measures.reduce<DateSetSource[]>(
      (acc, { beg_time, step_time, value }) => [
        ...acc,
        ...value.map(
          ([temperature], index): DateSetSource => ({
            timestamp: new Date((beg_time + index * (step_time ?? 1)) * 1000).toISOString(),
            temperature,
            name,
            roomId,
          })
        ),
      ],
      []
    );
  }

  private initChart(rooms: Room[]): void {
    this.chart = init(this.chartDiv.nativeElement);

    // https://echarts.apache.org/examples/en/editor.html?c=line-marker
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {},
      dataset: [
        {
          id: 'raw',
          dimensions: ['temperature', 'roomId', 'timestamp', 'name'],
          source: [],
        },
        ...rooms.map(({ id }) => ({
          id: id,
          fromDatasetId: 'raw',
          transform: {
            type: 'filter',
            config: { dimension: 'roomId', '=': id },
          },
        })),
      ],
      xAxis: {
        type: 'time',
        // axisLabel: {
        //   formatter: (value) => {
        //     return echarts.format.formatTime("hh:mm", value);
        //   },
        // },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C',
        },
        max: (value: { max: number }): number => Math.floor(value.max + 2),
        min: (value: { min: number }): number => Math.floor(value.min - 2),
      },
      series: rooms.map(({ name, id }) => ({
        name,
        type: 'line',
        encode: {
          x: 'timestamp',
          y: 'temperature',
        },
        datasetId: id,
        markLine: {
          data: [{ type: 'average', name: 'Avg' }],
        },
      })),
    };

    this.chart.setOption(option);
  }

  private updateChart(source: DateSetSource[]): void {
    this.chart.setOption({
      dataset: [{ source }],
      xAxis: {
        min: this.interval.begin.toISOString(),
        max: this.interval.end.toISOString(),
      },
    });
  }

  @HostListener('window:resize')
  private onResize() {
    this.chart.resize();
  }
}
