import { fakeAsync, tick } from '@angular/core/testing';
import { MatLegacyButton as MatButton } from '@angular/material/legacy-button';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { CustomUrlDialogComponent } from './custom-url-dialog.component';

describe('CustomUrlDialogComponent', () => {
  let fixture: MockedComponentFixture<CustomUrlDialogComponent>;

  beforeEach(async () => {
    await MockBuilder(CustomUrlDialogComponent);

    fixture = MockRender(CustomUrlDialogComponent);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should have choose button disabled', () => {
    expect(ngMocks.findInstance(ngMocks.find('mat-dialog-actions button:nth-of-type(2)'), MatButton).disabled).toBe(true);
  });

  it('should loader', fakeAsync(() => {
    const img = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
    ngMocks.change('input', img);
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();

    expect(ngMocks.find('col-loader')).not.toBeNull();
  }));

  it('should show image and active button when user enter correct url', fakeAsync(() => {
    const img = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
    ngMocks.change('input', img);
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();

    ngMocks.trigger('img', 'load', {});
    fixture.detectChanges();

    expect(ngMocks.find('img').properties['src']).toEqual(img);

    expect(ngMocks.findInstance(ngMocks.find('mat-dialog-actions button:nth-of-type(2)'), MatButton).disabled).toBe(false);
  }));

  it('should not show image and disable button when user enter wrong url', fakeAsync(() => {
    ngMocks.change('input', 'toto');
    fixture.detectChanges();

    tick(200);
    fixture.detectChanges();

    // ngMocks.trigger('img', 'error', {});
    // fixture.detectChanges();

    expect(ngMocks.findInstance(ngMocks.find('mat-dialog-actions button:nth-of-type(2)'), MatButton).disabled).toBe(true);
  }));
});
