import { HostListener, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { init, ECharts } from 'echarts';
import { map } from 'rxjs/operators';

import { MeasureType } from '../shared/api/enums/measure-type';
import { ModuleWithRoom } from '../shared/models/module-with-room';
import { filterFeature } from '../shared/stores/filter/filter.reducer';
import { homeActions } from '../shared/stores/home/home.actions';
import { measureFeature } from '../shared/stores/measure/measure.reducer';
import { selectModules, selectModuleWithEnabledMeasureType } from '../shared/stores/selectors';

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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.chart = init(this.chartDiv.nativeElement);

    this.store.dispatch(homeActions.fetch());

    this.store.select(selectModules).subscribe((modules) => this.setOptions(modules));
    this.store.select(filterFeature.selectInterval).subscribe((interval) =>
      this.chart.setOption({
        xAxis: {
          min: interval.begin,
          max: interval.end,
        },
      })
    );
    this.store.select(measureFeature.selectAll).subscribe((source) => this.chart.setOption({ dataset: [{ source }] }));
    this.store
      .select(selectModuleWithEnabledMeasureType)
      .pipe(
        map((modules) => {
          return modules.reduce((acc: any[], curr) => {
            return [
              ...acc,
              ...curr.enabledMeasureTypes.map((type) => ({
                id: `${curr.id}-${type}`,
                type: 'line',
                // colorBy: 'data',
                name: curr.name,
                encode: {
                  x: 'timestamp',
                  y: type,
                },
                datasetId: curr.id,
                markLine: {
                  data: [{ type: 'average', name: 'Avg' }],
                },
              })),
            ];
          }, []);
        })
      )
      .subscribe((series) => {
        console.log('series', series);
        this.chart.setOption({ series }, { replaceMerge: ['series'] });
      });

    /*
     name,
        type: 'line',
        encode: {
          x: 'timestamp',
          y: 'temperature',
        },
        datasetId: id,
        markLine: {
          data: [{ type: 'average', name: 'Avg' }],
        },*/
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
          dimensions: ['id', 'timestamp', ...Object.values(MeasureType)],
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
      series: [],
    };

    this.chart.setOption(option);
  }

  @HostListener('window:resize')
  private onResize() {
    this.chart.resize();
  }
}
