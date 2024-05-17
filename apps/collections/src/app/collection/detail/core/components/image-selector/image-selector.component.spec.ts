import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { ImageService } from '~shared/services/image.service';

import { CustomUrlDialogComponent } from './custom-url-dialog/custom-url-dialog.component';
import { ImageSelectorComponent } from './image-selector.component';
import { ImageFinderDialogComponent } from './images-finder-dialog/images-finder-dialog.component';

describe('ImageSelectorComponent', () => {
  let fixture: MockedComponentFixture<ImageSelectorComponent, { searchTerm: string[]; path: string; control: FormControl<string> }>;

  const imageService = { upload: jest.fn() };
  const dialog = { open: jest.fn() };
  const dialogRef = { afterClosed: jest.fn() };
  const searchTerm = ['teSt', 'SEARCH', 'Term'];

  beforeEach(async () => {
    dialogRef.afterClosed.mockReturnValue(of(undefined));
    dialog.open.mockReturnValue(dialogRef);

    await MockBuilder([ImageSelectorComponent, ReactiveFormsModule])
      .keep(FormsModule)
      .provide({ provide: MatDialog, useValue: dialog })
      .provide({ provide: ImageService, useValue: imageService });

    fixture = MockRender(`<col-images-selector [formControl]="control" [searchTerm]="searchTerm" [path]="path"></col-images-selector>`, {
      searchTerm,
      path: 'upload-path',
      control: new FormControl('assets/400x200.png', { nonNullable: true }),
    });
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should show image as init', () => {
    expect(ngMocks.input('img', 'colImg')).toEqual('assets/400x200.png');
  });

  it('should open image finder popup', () => {
    jest.spyOn(fixture.point.componentInstance, 'onTouched');
    ngMocks.click('button:nth-child(1)');
    fixture.detectChanges();

    expect(fixture.point.componentInstance.onTouched).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledWith(ImageFinderDialogComponent, {
      minWidth: '300px',
      width: '50%',
      data: searchTerm,
    });
  });

  it('should show found image when image finder popup was closed and upload complete', () => {
    imageService.upload.mockReturnValue(of('assets/400x200.png'));
    dialogRef.afterClosed.mockReturnValue(of('assets/400x200.png'));
    dialog.open.mockReturnValue(dialogRef);
    ngMocks.click('button:nth-child(1)');
    fixture.detectChanges();

    expect(ngMocks.input('img', 'colImg')).toEqual('assets/400x200.png');
    expect(imageService.upload).toHaveBeenCalledWith('upload-path', 'assets/400x200.png');
  });

  it('should open custom url popup', () => {
    jest.spyOn(fixture.point.componentInstance, 'onTouched');
    ngMocks.click('button:nth-child(2)');
    fixture.detectChanges();

    expect(fixture.point.componentInstance.onTouched).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledWith(CustomUrlDialogComponent, {
      width: '300px',
    });
  });

  it('should show image when custom url popup was closed and upload complete', () => {
    imageService.upload.mockReturnValue(of('assets/400x200.png'));
    dialogRef.afterClosed.mockReturnValue(of('assets/400x200.png'));
    dialog.open.mockReturnValue(dialogRef);
    ngMocks.click('button:nth-child(2)');
    fixture.detectChanges();

    expect(ngMocks.input('img', 'colImg')).toEqual('assets/400x200.png');
    expect(imageService.upload).toHaveBeenCalledWith('upload-path', 'assets/400x200.png');
  });

  it('should handle upload fail', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    testScheduler.run((helpers) => {
      const { cold, flush } = helpers;

      imageService.upload.mockReturnValue(cold('#'));
      dialogRef.afterClosed.mockReturnValue(of('assets/400x200.png'));
      dialog.open.mockReturnValue(dialogRef);
      ngMocks.click('button:nth-child(2)');
      fixture.detectChanges();

      flush();

      expect('mat-error').toHaveText(`Error durant l'upload`);
      expect(ngMocks.find('img', null)).toBeNull();
    });
  });

  it('should register the on change callback', () => {
    const spy = jest.fn();

    fixture.componentInstance.control.registerOnChange(spy);
    fixture.componentInstance.control.setValue('blue');

    expect(spy).toHaveBeenCalled();
  });

  it('should be disabled', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(fixture.point.componentInstance.disabled).toBe(true);
  });
});
