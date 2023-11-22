import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks } from 'ng-mocks';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: MockedComponentFixture<ConfirmDialogComponent>;

  const data: ConfirmDialogData = {
    title: 'Expecteed title',
    content: 'Expecteed content',
    confirmText: 'Expecteed confirmText',
    cancelText: 'Expecteed cancelText',
  };

  beforeEach(async () => {
    await MockBuilder(ConfirmDialogComponent).provide({ provide: MAT_DIALOG_DATA, useValue: data });

    fixture = MockRender(ConfirmDialogComponent);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should display provide value', () => {
    expect(ngMocks.formatText(ngMocks.find('h2 span'))).toContain(data.title);
    expect(ngMocks.formatText(ngMocks.find('mat-dialog-content p'))).toContain(data.content);
    expect(ngMocks.formatText(ngMocks.find('button:nth-of-type(1)'))).toContain(data.cancelText);
    expect(ngMocks.formatText(ngMocks.find('button:nth-of-type(2)'))).toContain(data.confirmText);
  });
});
