import { FormBuilder, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MockBuilder, MockRender, MockedComponentFixture, ngMocks, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';

import { TomeDialogComponent } from './tome-dialog.component';

describe('TomeDialogComponent', () => {
  let fixture: MockedComponentFixture<TomeDialogComponent>;

  const builder = new FormBuilder();
  const tome = builder.group({
    number: ['1', Validators.required],
    acquired: [false],
    cover: ['assets/75x118.png'],
  });

  beforeEach(async () => {
    await MockBuilder(TomeDialogComponent)
      .provide({
        provide: MAT_DIALOG_DATA,
        useValue: {
          title: 'Title',
          id: 'uuid',
          tome,
        },
      })
      .keep(NG_MOCKS_ROOT_PROVIDERS);

    fixture = MockRender(TomeDialogComponent);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should have title', () => {
    expect(ngMocks.formatText(ngMocks.find('h2'))).toContain('Tome - Title');
  });

  it('should have image selector component', () => {
    expect(ngMocks.input('col-images-selector', 'searchTerm')).toEqual(['Title', 'cover', 'tome', '1']);
    expect(ngMocks.input('col-images-selector', 'path')).toEqual('tomes/uuid/1');
  });
});
