import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { HeaderComponent } from './header/header.component';
import { LayoutEffects } from './layout.effects';
import { layoutFeature } from './layout.reducer';
import { SidePanelComponent } from './sidepanel/sidepanel.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(layoutFeature),
    EffectsModule.forFeature([LayoutEffects]),
    HeaderComponent,
    SidePanelComponent,
  ],
  exports: [HeaderComponent, SidePanelComponent],
})
export class LayoutModule {}
