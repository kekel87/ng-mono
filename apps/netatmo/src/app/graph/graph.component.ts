import { HostListener, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { init, ECharts } from 'echarts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MeasureType } from '../shared/api/enums/measure-type';
import { Measure } from '../shared/api/models/measure';
import { NetatmoService } from '../shared/api/servives/netatmo.service';
import { IntervalType } from '../shared/enums/interval-type';
import { ModuleWithRoom } from '../shared/models/module-with-room';
import { homeActions } from '../shared/stores/home/home.actions';
import { selectModules } from '../shared/stores/selectors';
import { getInterval } from '../shared/utils/date-interval';
import { dateToUnixTimestamp } from '../shared/utils/date-to-unix-timestamp';

type DateSetSource = { timestamp: string; temperature: number; name: string; id: string };

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
  private interval = getInterval(IntervalType.Day);

  constructor(private netamoService: NetatmoService, private store: Store) {}

  ngOnInit(): void {
    this.chart = init(this.chartDiv.nativeElement);

    this.store.dispatch(homeActions.fetch());

    this.store.select(selectModules).subscribe((modules) => this.setOptions(modules));

    // this.netamoService
    //   .getHomesData()
    //   .pipe(
    //     map(({ body }) => body.homes[0]),
    //     tap(({ rooms }) => this.initChart(rooms)),
    //     switchMap(({ modules }) =>
    //       forkJoin(
    //         modules
    //           .filter(hasRoom)
    //           .filter((module) => MEASURE_TYPE_BY_MODULE_TYPE[module.type].includes(MeasureType.Temperature))
    //           .map((module) => this.getModuleMeasureDataSetSource(module))
    //       )
    //     ),
    //     map((dataSetSources) => dataSetSources.flat())
    //   )
    //   .subscribe((dataSetSource) => {
    //     this.updateChart(dataSetSource);
    //   });
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

  private toDataSetSource(name: string, id: string, measures: Measure[]): DateSetSource[] {
    return measures.reduce<DateSetSource[]>(
      (acc, { beg_time, step_time, value }) => [
        ...acc,
        ...value.map(
          ([temperature], index): DateSetSource => ({
            timestamp: new Date((beg_time + index * (step_time ?? 1)) * 1000).toISOString(),
            temperature,
            name,
            id,
          })
        ),
      ],
      []
    );
  }

  private setOptions(modules: ModuleWithRoom[]): void {
    // https://echarts.apache.org/examples/en/editor.html?c=line-marker
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {},
      dataset: [
        {
          id: 'raw',
          dimensions: ['temperature', 'id', 'timestamp', 'name'],
          source: [],
        },
        ...modules.map(({ id }) => ({
          id: id,
          fromDatasetId: 'raw',
          transform: {
            type: 'filter',
            config: { dimension: 'id', '=': id },
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
      series: modules.map(({ name, id }) => ({
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
        min: this.interval.begin,
        max: this.interval.end,
      },
    });
  }

  @HostListener('window:resize')
  private onResize() {
    this.chart.resize();
  }
}
