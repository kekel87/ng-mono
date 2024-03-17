import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockBuilder, MockRender, MockedComponentFixture } from 'ng-mocks';

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
    expect('h2 span').toHaveText(data.title);
    expect('p').toHaveText(data.content);
    expect('button').toHaveAllText([data.cancelText, data.confirmText]);
  });
});
