import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs/operators';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { Book } from '~shared/models/book';
import { Tome } from '~shared/models/tome';

import { CreateTomesDialogComponent } from './core/components/create-tomes-dialog/create-tomes-dialog.component';
import { CreateTomesDialogModule } from './core/components/create-tomes-dialog/create-tomes-dialog.module';
import { TomeDialogComponent } from './core/components/tome-dialog/tome-dialog.component';
import { TomeForm } from './core/models/tome-form';
import { ConfirmDialogComponent } from '../core/components/confirm-dialog/confirm-dialog.component';
import { DetailComponent } from '../core/components/detail/detail.component';
import { ImageSelectorComponent } from '../core/components/image-selector/image-selector.component';

type ComicBookForm = FormGroup<{
  id: FormControl<string>;
  acquired: FormControl<boolean>;
  title: FormControl<string>;
  authors: FormArray<FormControl<string>>;
  publisher: FormControl<string>;
  image: FormControl<string>;
  comment: FormControl<string | undefined>;
  tomes: FormArray<TomeForm>;
}>;

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'col-comic-book-detail',
  templateUrl: './comic-book-detail.component.html',
  styleUrls: ['../core/components/detail/detail.component.scss', './comic-book-detail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    LoaderComponent,
    ConfirmDialogComponent,
    ImageSelectorComponent,
    TomeDialogComponent,
    CreateTomesDialogModule,
  ],
})
export class ComicBookDetailComponent extends DetailComponent<Book, ComicBookForm> {
  isOneShot = false;

  get titleControl(): FormControl<string> {
    return this.form.controls.title;
  }

  initForm(): string {
    const book = this.item;

    this.isOneShot = book.tomes.length === 0;

    this.form = this.formBuilder.nonNullable.group({
      id: [book.id, [Validators.required]],
      acquired: [book.acquired, [Validators.required]],
      title: [book.title, [Validators.required]],
      authors: this.formBuilder.array(
        book.authors.map((author) => this.formBuilder.nonNullable.control(author, Validators.required)),
        Validators.min(1)
      ),
      publisher: [book.publisher, [Validators.required]],
      image: [book.image, [Validators.required]],
      comment: [{ value: book.comment, disabled: true }],
      tomes: this.formBuilder.array(book.tomes.map((t) => this.toTomeFormGroup(t))),
    });

    this.form.controls.tomes.valueChanges.pipe(debounceTime(200), untilDestroyed(this)).subscribe((value: Partial<Tome>[]) => {
      const imageFormControl = this.form.controls.image;
      if (imageFormControl && imageFormControl.value === 'assets/400x200.png') {
        const firstTome = value.find((tome: Partial<Tome>) => tome.number === 1 && tome.cover !== 'assets/75x118.png');
        if (firstTome && firstTome.cover) {
          imageFormControl.patchValue(firstTome.cover);
          this.changeDetectorRef.markForCheck();
        }
      }
    });

    return book.title;
  }

  addNewTome(): void {
    this.form.controls.tomes.insert(
      0,
      this.formBuilder.nonNullable.group({
        number: [this.getLastTomeNumber(), Validators.required],
        acquired: [true],
        cover: ['assets/75x118.png'],
      })
    );
  }

  addManyTomes(): void {
    this.dialog
      .open(CreateTomesDialogComponent, {
        width: '300px',
        data: {
          start: this.getLastTomeNumber(),
        },
      })
      .afterClosed()
      .subscribe((range) => {
        if (range) {
          for (let i = range.from; i <= range.to; i++) {
            this.form.controls.tomes.insert(
              0,
              this.formBuilder.nonNullable.group({
                number: [i, Validators.required],
                acquired: [true],
                cover: ['assets/75x118.png'],
              })
            );
          }
          this.sortTomes();
        }
      });
  }

  addAuthor(): void {
    this.form.controls.authors.push(this.formBuilder.nonNullable.control('', Validators.required));
  }

  editTome(index: number): void {
    this.dialog
      .open(TomeDialogComponent, {
        width: '300px',
        data: {
          title: this.titleControl.value,
          id: this.item.id,
          tome: this.form.controls.tomes.at(index),
        },
      })
      .afterClosed()
      .subscribe((toDelete) => {
        if (toDelete) {
          this.deleteTome(index);
        }
        this.sortTomes();
      });
  }

  deleteTome(index: number): void {
    this.form.controls.tomes.removeAt(index);
    this.changeDetectorRef.markForCheck();
  }

  deleteAuthor(index: number): void {
    this.form.controls.authors.removeAt(index);
    this.changeDetectorRef.markForCheck();
  }

  private getLastTomeNumber(): number {
    return this.form.controls.tomes.length ? this.form.controls.tomes.at(0).controls.number.value + 1 : 1;
  }

  private toTomeFormGroup(tome: Tome): TomeForm {
    return this.formBuilder.nonNullable.group({
      number: [tome.number, Validators.required],
      acquired: [tome.acquired],
      cover: [tome.cover],
    });
  }

  private sortTomes(): void {
    const tomes = [...this.form.controls.tomes.value] as Tome[];
    tomes.sort((t1, t2) => t2.number - t1.number);
    this.form.controls.tomes.patchValue(tomes);
  }
}