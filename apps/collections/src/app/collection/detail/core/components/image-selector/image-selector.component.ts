import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { OperatorFunction, of, pipe } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';

import { LoaderComponent } from '~shared/components/loader/loader.component';
import { RequestState } from '~shared/enums/request-state';
import { ImageService } from '~shared/services/image.service';
import { hasValue } from '~shared/utils/type-guards';

import { CustomUrlDialogComponent } from './custom-url-dialog/custom-url-dialog.component';
import { ImageFinderDialogComponent } from './images-finder-dialog/images-finder-dialog.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    LoaderComponent,
    CustomUrlDialogComponent,
    ImageFinderDialogComponent,
  ],
  selector: 'col-images-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageSelectorComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSelectorComponent implements ControlValueAccessor {
  @Input()
  searchTerm: string[] = [];
  @Input()
  path = '';
  @Input()
  disabled = false;

  current: string | undefined;
  uploadState = RequestState.Initial;

  readonly RequestState = RequestState;

  constructor(private dialog: MatDialog, private imageService: ImageService, private cd: ChangeDetectorRef) {}

  onChange: (url: string) => void = () => {
    /* This is fine */
  };
  onTouched: () => void = () => {
    /* This is fine */
  };

  openImagesChooser(): void {
    this.dialog
      .open(ImageFinderDialogComponent, {
        minWidth: '300px',
        width: '50%',
        data: this.searchTerm,
      })
      .afterClosed()
      .pipe(this.upload())
      .subscribe((url: string) => {
        this.uploadState = RequestState.Success;
        this.onChange(url);
        this.writeValue(url);
      });
  }

  addUrl(): void {
    this.dialog
      .open(CustomUrlDialogComponent, {
        width: '300px',
      })
      .afterClosed()
      .pipe(this.upload())
      .subscribe((url: string) => {
        this.uploadState = RequestState.Success;
        this.onChange(url);
        this.writeValue(url);
      });
  }

  private upload(): OperatorFunction<string, string> {
    return pipe(
      filter((url) => !!url),
      tap(() => {
        this.uploadState = RequestState.Loading;
        this.cd.detectChanges();
      }),
      switchMap((url: string) => this.imageService.upload(this.path, url)),
      catchError(() => {
        this.uploadState = RequestState.Error;
        this.cd.detectChanges();
        return of(null);
      }),
      filter(hasValue)
    );
  }

  writeValue(url: string): void {
    this.current = url;
    this.cd.detectChanges();
  }

  registerOnChange(fn: (url: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
