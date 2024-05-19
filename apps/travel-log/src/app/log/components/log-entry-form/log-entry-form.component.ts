import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { gpx as gpxToGeojson } from '@tmcw/togeojson';
import bbox from '@turf/bbox';
import { BBox, FeatureCollection, Geometry } from 'geojson';
import { GPX } from 'leaflet';

export interface LogEntry {
  id?: string;
  title: string;
  bbox: BBox;
  geoJson: any;
  start?: string;
  end?: string;
  distance?: number;
  movingTime?: number;
  averageMovingSpeed?: number;
  averageTemperature?: number;
  elevationGain?: number;
}

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormField, MatIcon, MatLabel, MatInput],
  templateUrl: './log-entry-form.component.html',
  styleUrls: ['./log-entry-form.component.scss'],
})
export class LogEntryFormComponent {
  protected readonly formGroup = this.formBuilder.group({
    title: this.formBuilder.nonNullable.control<string>('', Validators.required),
    tags: this.formBuilder.nonNullable.array<string>([]),
    entries: this.formBuilder.nonNullable.array<LogEntry>([], Validators.required),
  });

  constructor(
    private store: Store,
    private formBuilder: FormBuilder
  ) {}

  protected onFileSelected(event: Event) {
    if (!event.target) {
      return;
    }
    const target = event.target as HTMLInputElement;

    console.log(target.files);

    this.readFile(target.files![0]);
  }

  protected readFile(file: File) {
    const reader = new FileReader();
    reader.addEventListener('load', () => this.parse(reader.result as string), false);
    reader.readAsText(file);
  }

  private parse(file: string) {
    const geoJson = gpxToGeojson(new DOMParser().parseFromString(file, 'text/xml')) as FeatureCollection<Geometry>;

    const gpx = new GPX(file, {
      async: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      marker_options: {
        startIconUrl: undefined,
        endIconUrl: undefined,
        shadowUrl: undefined,
      },
    });

    console.log(geoJson);
    console.log(gpx);

    this.formGroup.controls.entries.push(
      this.formBuilder.nonNullable.control<LogEntry>({
        title: gpx.get_name(),
        geoJson,
        bbox: bbox(geoJson),
        start: gpx.get_start_time().toISOString(),
        end: gpx.get_end_time().toISOString(),
        distance: gpx.get_distance(),
        movingTime: gpx.get_moving_time(),
        averageMovingSpeed: gpx.get_moving_speed(),
        averageTemperature: gpx.get_average_temp(),
        elevationGain: gpx.get_elevation_gain(),
      })
    );
  }
}
