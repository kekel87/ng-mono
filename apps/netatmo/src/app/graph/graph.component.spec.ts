import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GraphComponent } from './graph.component';

describe('GraphComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphComponent, RouterTestingModule],
    }).compileComponents();
  });
});
