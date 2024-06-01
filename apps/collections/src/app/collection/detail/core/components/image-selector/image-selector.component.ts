import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OperatorFunction, of, pipe } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';

import { hasValue, RequestState } from '@ng-mono/shared/utils';
import { LoaderComponent } from '~shared/components/loader/loader.component';
import { ImageDowloaderDirective } from '~shared/directives/image-downloader/image-downloader.directive';
import { ImageService } from '~shared/services/image.service';

import { CustomUrlDialogComponent } from './custom-url-dialog/custom-url-dialog.component';
import { ImageFinderDialogComponent } from './images-finder-dialog/images-finder-dialog.component';

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    LoaderComponent,
    CustomUrlDialogComponent,
    ImageFinderDialogComponent,
    ImageDowloaderDirective,
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

  constructor(
    private dialog: MatDialog,
    private imageService: ImageService,
    private cd: ChangeDetectorRef
  ) {}

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
