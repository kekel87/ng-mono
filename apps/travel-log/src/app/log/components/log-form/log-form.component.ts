import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem, MatListItemMeta } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import bbox from '@turf/bbox';
import { BBox } from 'geojson';
import { fromEvent, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { DropzoneComponent } from '@ng-mono/shared/ui';
import { greaterIsoStringDate, lowerIsoStringDate, moveItemInFormArray } from '@ng-mono/shared/utils';

import { FromGeoJsonDirective } from '../../../shared/directive/from-geojson.directive';
import { LogComputedField } from '../../models/log';
import { LogEntrySave } from '../../models/log-entry';
import { logActions } from '../../stores/log/log.actions';
import { gpxToLogEntrySave } from '../../utils/gpx-to-log-entry-save';
import { LogEntryComponent } from '../log-entry/log-entry.component';

@Component({
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    LogEntryComponent,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatList,
    MatListItem,
    DropzoneComponent,
    FromGeoJsonDirective,
    CdkDropList,
    CdkDrag,
    MatListItemMeta,
  ],
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.scss'],
})
export class LogFormComponent {
  protected readonly formGroup = this.formBuilder.group({
    id: this.formBuilder.nonNullable.control<string | undefined>(undefined),
    name: this.formBuilder.nonNullable.control<string>('', Validators.required),
    tags: this.formBuilder.nonNullable.array<string>([]),
    files: this.formBuilder.nonNullable.control<File[]>([]),
    entries: this.formBuilder.nonNullable.array<LogEntrySave>([], Validators.required),

    bbox: this.formBuilder.nonNullable.control<BBox>([0, 0, 0, 0], Validators.required),
    geoJson: this.formBuilder.nonNullable.control<any>(undefined, Validators.required),
    distance: this.formBuilder.nonNullable.control<number>(0, Validators.required),
    elevationGain: this.formBuilder.nonNullable.control<number>(0, Validators.required),

    start: this.formBuilder.nonNullable.control<string | undefined>(undefined),
    end: this.formBuilder.nonNullable.control<string | undefined>(undefined),
  });

  constructor(
    private store: Store,
    private formBuilder: FormBuilder
  ) {
    this.formGroup.controls.files.valueChanges.pipe(takeUntilDestroyed()).subscribe((files: File[]) => {
      this.onFileSelected(files);
    });
  }

  protected onFileSelected(files: File[]) {
    zip(
      files.map((file: File) => {
        const fileReader = new FileReader();

        // ça serait bien d'ajouter un loader ici, car ça peut mettre du temps
        const logEntry$ = fromEvent(fileReader, 'loadend').pipe(
          map(() => gpxToLogEntrySave(fileReader.result as string))
          // tap((logEntry) => this.formGroup.controls.entries.push(this.formBuilder.nonNullable.control(logEntry)))
        );

        fileReader.readAsText(file as Blob);
        return logEntry$;
      })
    ).subscribe((logEntries) => {
      // Insert here to conserve order
      logEntries.forEach((logEntry) => {
        this.formGroup.controls.entries.push(this.formBuilder.nonNullable.control(logEntry));
      });

      this.updateLogComputedField();
    });
  }

  private updateLogComputedField(): void {
    const log = (this.formGroup.value.entries as LogEntrySave[]).reduce<Omit<LogComputedField, 'bbox'>>(
      (acc, curr) => ({
        ...acc,
        geoJson: { ...curr.geoJson, features: [...acc.geoJson.features, ...curr.geoJson.features] },
        distance: acc.distance + (curr.distance ?? 0),
        elevationGain: acc.elevationGain + (curr.elevationGain ?? 0),
        start: lowerIsoStringDate(acc.start, curr.start),
        end: greaterIsoStringDate(acc.end, curr.end),
      }),
      { geoJson: { features: [] }, distance: 0, elevationGain: 0, start: undefined, end: undefined }
    );

    this.formGroup.patchValue({ ...log, bbox: bbox(log.geoJson) });
  }

  protected removeEntry(index: number): void {
    this.formGroup.controls.entries.removeAt(index);
    this.updateLogComputedField();
  }

  protected drop(event: CdkDragDrop<string[]>): void {
    moveItemInFormArray(this.formGroup.controls.entries, event.previousIndex, event.currentIndex);
  }

  protected submit(): void {
    const { files, ...log } = this.formGroup.getRawValue();
    this.store.dispatch(logActions.save({ log }));
  }
}
