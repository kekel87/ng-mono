import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem, MatListItemMeta } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { DropzoneComponent } from '@ng-mono/shared/ui';
import { greaterIsoStringDate, hasValue, isEmpty, lowerIsoStringDate, moveItemInFormArray } from '@ng-mono/shared/utils';
import { ActionsSubject, Store } from '@ngrx/store';
import bbox from '@turf/bbox';
import { BBox } from 'geojson';
import { fromEvent, zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { FromGeoJsonDirective } from '../../../shared/directive/from-geojson.directive';
import { EntrySave } from '../../models/entry';
import { Log } from '../../models/log';
import { entryActions } from '../../stores/entry/entry.actions';
import { logActions } from '../../stores/log/log.actions';
import { gpxToLogEntrySave } from '../../utils/gpx-to-log-entry-save';
import { EntryComponent } from '../entry/entry.component';

interface ComputedFields extends Pick<Log, 'start' | 'end'> {
  geoJson: NonNullable<Log['geoJson']>;
  distance: NonNullable<Log['distance']>;
  elevationGain: NonNullable<Log['elevationGain']>;
}

@Component({
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    EntryComponent,
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
  protected readonly filesLoading = signal(false);

  /**
   * J'aimerais bien faire une sauvegarde auto 🤔
   * Il faut que je mette le titre nom obligatoire et les données computé non plus.
   * Dans la liste, il faut juste prévoir qu'il ne peux ne pas y avoir de données (genre pas de titre, et de données géo).
   * 💡 on peut aussi affiche une alerte pour les log vide.
   *
   * Intérations possible:
   * - l'user créer un nouveau log, il est vide on ne fait rien
   *
   * - l'user ajouter un ou pluiseurs entry
   *    - on compute les données du log
   *    - on sauvegarde le log (comme ça j'ai un uuid)
   *    - on sauvegarde les entries
   *
   * - l'user change le nom du log on sauvegarde que ça (si il a un id / une entry)
   * - l'user change le nom d'une entry, on la mets a jours (juste le nom)
   * - l'user supprime un entry, on la delete et on sauvegarde les données calculés du log
   *
   *  💡 Si l'user supprime la dernière entry, on peut lui proposer de suppriler le log vide.
   *  💡 Je pourrais ajouter au store direct et géré l'état de sauvegarde.
   */

  protected readonly formGroup = this.formBuilder.group({
    id: this.formBuilder.control<string | null>(null),
    name: this.formBuilder.control<string | null>(null, Validators.required),
    description: this.formBuilder.control<string | null>(null),
    tags: this.formBuilder.nonNullable.array<string>([]),
    bbox: this.formBuilder.control<BBox | null>(null),
    geoJson: this.formBuilder.control<any>(null),
    distance: this.formBuilder.control<number | null>(null),
    elevationGain: this.formBuilder.control<number | null>(null),
    start: this.formBuilder.control<string | null>(null),
    end: this.formBuilder.control<string | null>(null),

    files: this.formBuilder.nonNullable.control<File[]>([]),
    entries: this.formBuilder.nonNullable.array<EntrySave>([]),
  });

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private actions$: ActionsSubject
  ) {
    this.formGroup.controls.files.valueChanges.pipe(takeUntilDestroyed()).subscribe((files: File[]) => {
      this.onFileSelected(files);
    });

    /** l'user change le nom du log on sauvegarde que ça */
    this.formGroup.controls.name.valueChanges.pipe(takeUntilDestroyed(), filter(hasValue)).subscribe((name) => {
      const id = this.formGroup.value.id;
      if (hasValue(id)) {
        this.store.dispatch(logActions.save({ log: { id, name } }));
      }
    });
  }

  protected onFileSelected(files: File[]) {
    this.filesLoading.set(true);
    zip(
      files.map((file: File) => {
        const fileReader = new FileReader();

        const logEntry$ = fromEvent(fileReader, 'loadend').pipe(map(() => gpxToLogEntrySave(fileReader.result as string)));

        fileReader.readAsText(file as Blob);
        return logEntry$;
      })
    ).subscribe((logEntries) => {
      this.filesLoading.set(false);

      // Insert here to conserve order
      logEntries.forEach((logEntry) => {
        this.formGroup.controls.entries.push(this.formBuilder.nonNullable.control(logEntry));
      });

      this.updateLogComputedField(logEntries);
    });
  }

  private updateLogComputedField(newEntries: EntrySave[] = []): void {
    const { files, tags, entries, ...rLog } = this.formGroup.getRawValue();

    const computedFields = entries.reduce<ComputedFields>(
      (acc, curr) => ({
        ...acc,
        geoJson: { ...curr.geoJson, features: [...acc.geoJson.features, ...curr.geoJson.features] },
        distance: acc.distance + (curr.distance ?? 0),
        elevationGain: acc.elevationGain + (curr.elevationGain ?? 0),
        start: lowerIsoStringDate(acc.start, curr.start),
        end: greaterIsoStringDate(acc.end, curr.end),
      }),
      { geoJson: { features: [] }, distance: 0, elevationGain: 0, start: null, end: null }
    );

    const log = { ...rLog, ...computedFields, bbox: bbox(computedFields.geoJson) };

    this.formGroup.patchValue(log);

    if (isEmpty(newEntries)) {
      this.store.dispatch(logActions.save({ log }));
    } else {
      this.store.dispatch(logActions.saveLogAndEntries({ log, entries }));
    }
  }

  protected removeEntry(index: number): void {
    const entry = this.formGroup.controls.entries.at(index).value;

    if (entry.id) {
      this.store.dispatch(entryActions.delete({ id: entry.id }));
    }
    this.formGroup.controls.entries.removeAt(index);

    this.updateLogComputedField();
  }

  protected drop(event: CdkDragDrop<string[]>): void {
    moveItemInFormArray(this.formGroup.controls.entries, event.previousIndex, event.currentIndex);
  }
}
