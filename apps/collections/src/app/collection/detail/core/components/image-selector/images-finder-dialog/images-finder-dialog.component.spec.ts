import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { ImageService } from '~shared/services/image.service';
import * as mockImage from '~tests/mocks/images';

import { ImageFinderDialogComponent } from './images-finder-dialog.component';

describe('ImageFinderDialogComponent', () => {
  let fixture: MockedComponentFixture<ImageFinderDialogComponent>;
  const imageService = { findGoogleImages: jest.fn() };
  const searchTerm = ['seach', 'term'];

  beforeEach(async () => {
    imageService.findGoogleImages.mockReturnValue(of(mockImage.images));

    await MockBuilder(ImageFinderDialogComponent)
      .provide({ provide: MAT_DIALOG_DATA, useValue: searchTerm })
      .provide({ provide: ImageService, useValue: imageService });

    fixture = MockRender(ImageFinderDialogComponent);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should display search images on init', () => {
    expect(imageService.findGoogleImages).toHaveBeenCalledWith(searchTerm);
    expect(ngMocks.findAll('img').length).toBe(2);
    expect(ngMocks.find('mat-dialog-content > full-page-loader', null)).toBeNull();
  });

  it('should get more images', () => {
    ngMocks.click('mat-dialog-content button');
    fixture.detectChanges();

    expect(imageService.findGoogleImages).toHaveBeenCalledWith(searchTerm, 3);
    expect(ngMocks.findAll('img').length).toBe(4);
    expect(ngMocks.find(' mat-dialog-content button > full-page-loader', null)).toBeNull();
  });

  it('should have choose button disabled', () => {
    expect(ngMocks.find('mat-dialog-actions button:nth-of-type(2)').properties['disabled']).toBeDefined();
  });

  it('should turn on the button and highlight image when she is selected', () => {
    ngMocks.click('li:nth-of-type(1)');
    fixture.detectChanges();

    expect(ngMocks.find('li:nth-of-type(1)').classes['selected']).toBe(true);
    expect(ngMocks.find('mat-dialog-actions button:nth-of-type(2)').properties['disabled']).toBeFalsy();
  });
});
