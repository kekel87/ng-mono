import { MatLegacySnackBarConfig as MatSnackBarConfig } from '@angular/material/legacy-snack-bar';
import { Action } from '@ngrx/store';

export interface SnackbarOptions {
  message: string;
  action?: string;
  onAction?: Action;
  config?: MatSnackBarConfig;
}

export interface ToolbarConfig {
  title?: string;
  actions?: {
    icon: string;
    onAction?: Action;
    color?: string;
  }[];
}
