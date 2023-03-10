import { HostListener, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { Store, ActionsSubject } from '@ngrx/store';
import { init, ECharts } from 'echarts';
import { interval } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { layoutActions } from '../layout/store/layout.actions';
import { MeasureType } from '../shared/api/enums/measure-type';
import { ModuleWithMeasureTypes } from '../shared/models/module-with-measure-types';
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

  constructor(private store: Store, private action$: ActionsSubject) {
    this.action$
      .pipe(
        ofType(layoutActions.sidenavStartAnimated),
        switchMap(() => interval(20).pipe(takeUntil(this.action$.pipe(ofType(layoutActions.sidenavEndAnimated)))))
      )
      .subscribe(() => {
        this.onResize();
      });
  }

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
            return [...acc, ...curr.enabledMeasureTypes.map((type) => this.toSerie(type, curr))];
          }, []);
        })
      )
      .subscribe((series) => this.chart.setOption({ series }, { replaceMerge: ['series'] }));
  }

  private toSerie(type: MeasureType, module: ModuleWithMeasureTypes) {
    switch (type) {
      case MeasureType.Temperature:
        return this.toTemperatureSerie(module);
      case MeasureType.CO2:
        return this.toCo2Serie(module);
      case MeasureType.Pressure:
        return this.toPressureSerie(module);
      case MeasureType.Humidity:
        return this.toHumiditySerie(module);
      case MeasureType.Noise:
        return this.toNoiseSerie(module);
      default:
        throw new Error('Measure type not supported');
    }
  }

  private toTemperatureSerie(module: ModuleWithMeasureTypes) {
    return {
      id: `${module.id}-${MeasureType.Temperature}`,
      type: 'line',
      yAxisId: MeasureType.Temperature,
      datasetId: module.id,
      name: module.name,
      color: module.measureTypeColors[MeasureType.Temperature],
      encode: {
        x: 'timestamp',
        y: MeasureType.Temperature,
      },
      // markLine: {
      //   data: [{ type: 'average', name: 'Avg' }],
      // },
    };
  }

  private toCo2Serie(module: ModuleWithMeasureTypes) {
    return {
      id: `${module.id}-${MeasureType.CO2}`,
      type: 'line',
      yAxisId: MeasureType.CO2,
      datasetId: module.id,
      name: module.name,
      color: module.measureTypeColors[MeasureType.CO2],
      encode: {
        x: 'timestamp',
        y: MeasureType.CO2,
      },
    };
  }

  private toPressureSerie(module: ModuleWithMeasureTypes) {
    return {
      id: `${module.id}-${MeasureType.Pressure}`,
      type: 'line',
      yAxisId: MeasureType.Pressure,
      datasetId: module.id,
      name: module.name,
      color: module.measureTypeColors[MeasureType.Pressure],
      encode: {
        x: 'timestamp',
        y: MeasureType.Pressure,
      },
    };
  }

  private toHumiditySerie(module: ModuleWithMeasureTypes) {
    return {
      id: `${module.id}-${MeasureType.Humidity}`,
      type: 'line',
      yAxisId: MeasureType.Humidity,
      datasetId: module.id,
      name: module.name,
      color: module.measureTypeColors[MeasureType.Humidity],
      encode: {
        x: 'timestamp',
        y: MeasureType.Humidity,
      },
      areaStyle: {
        color: module.measureTypeColors[MeasureType.Humidity],
        opacity: 0.2,
      },
    };
  }

  private toNoiseSerie(module: ModuleWithMeasureTypes) {
    return {
      id: `${module.id}-${MeasureType.Noise}`,
      type: 'line',
      yAxisId: MeasureType.Noise,
      datasetId: module.id,
      color: module.measureTypeColors[MeasureType.Noise],
      name: module.name,
      encode: {
        x: 'timestamp',
        y: MeasureType.Noise,
      },
    };
  }

  private setOptions(modules: ModuleWithRoom[]): void {
    // https://echarts.apache.org/examples/en/editor.html?c=line-marker
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        show: false,
      },
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
      yAxis: [
        {
          id: MeasureType.Temperature,
          name: MeasureType.Temperature,
          type: 'value',
          axisLabel: {
            formatter: '{value} °C',
          },
          max: (value: { max: number }): number => Math.floor(value.max + 2),
          min: (value: { min: number }): number => Math.floor(value.min - 2),
        },
        {
          id: MeasureType.Humidity,
          name: MeasureType.Humidity,
          type: 'value',
          position: 'right',
          offset: 0,
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value} %',
          },
          max: 100,
          min: 0,
        },
        {
          id: MeasureType.CO2,
          name: MeasureType.CO2,
          position: 'right',
          offset: 40,
          type: 'value',
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value} ppm',
          },
        },
        {
          id: MeasureType.Pressure,
          name: MeasureType.Pressure,
          type: 'value',
          position: 'right',
          offset: 80,
          axisLabel: {
            formatter: '{value} mb',
          },
          max: (value: { max: number }): number => Math.floor(value.max + 100),
          min: (value: { min: number }): number => Math.floor(value.min - 100),
        },
        {
          id: MeasureType.Noise,
          name: MeasureType.Noise,
          type: 'value',
          position: 'right',
          offset: 80,
          axisLabel: {
            formatter: '{value} db',
          },
        },
      ],
      series: [],
    };

    this.chart.setOption(option);
  }

  @HostListener('window:resize')
  private onResize() {
    this.chart.resize();
  }
}
