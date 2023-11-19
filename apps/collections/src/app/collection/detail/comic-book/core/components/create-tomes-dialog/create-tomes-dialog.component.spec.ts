import { FormControlName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';

import { CreateTomesDialogComponent } from './create-tomes-dialog.component';
import { CreateTomesDialogModule } from './create-tomes-dialog.module';

describe('CreateTomesDialogComponent', () => {
  let fixture: MockedComponentFixture<CreateTomesDialogComponent>;

  beforeEach(async () => {
    await MockBuilder(CreateTomesDialogComponent, CreateTomesDialogModule)
      .keep(FormsModule)
      .keep(ReactiveFormsModule)
      .provide({ provide: MAT_DIALOG_DATA, useValue: { start: 2 } })
      .keep(NG_MOCKS_ROOT_PROVIDERS);

    fixture = MockRender(CreateTomesDialogComponent);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should display title', () => {
    expect(ngMocks.formatText(ngMocks.find('h2'))).toContain('Ajouter plusieurs tomes');
  });

  it('should display init range', () => {
    expect(ngMocks.findInstance('[formControlName="from"]', FormControlName).value).toEqual(2);
    expect(ngMocks.findInstance('[formControlName="to"]', FormControlName).value).toEqual(3);
  });

  it('should have add button enable and no error message', () => {
    expect(ngMocks.findInstance('mat-dialog-actions button:nth-of-type(2)', MatButton).disabled).toBe(false);
    expect(ngMocks.find('mat-error', null)).toBeNull();
  });

  it('should display error message and disable button if from is lower than 1', () => {
    ngMocks.change('[formControlName="from"]', '0');
    fixture.detectChanges();

    expect(ngMocks.formatText(ngMocks.find('mat-error'))).toContain('Saisie invalide');
    expect(ngMocks.findInstance('mat-dialog-actions button:nth-of-type(2)', MatButton).disabled).toBe(true);
  });

  it('should display error message and disable button if from greater than to', () => {
    ngMocks.change('[formControlName="from"]', '3');
    fixture.detectChanges();

    expect(ngMocks.formatText(ngMocks.find('mat-error'))).toContain('Saisie invalide');
    expect(ngMocks.findInstance('mat-dialog-actions button:nth-of-type(2)', MatButton).disabled).toBe(true);
  });
});
