import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'col-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  public config: ConfirmDialogData;

  constructor(@Inject(MAT_DIALOG_DATA) data: Partial<ConfirmDialogData>) {
    this.config = {
      ...{
        title: 'Confirmation',
        content: 'Êtes-vous sûr ?',
        confirmText: 'Oui',
        cancelText: 'Non',
      },
      ...data,
    };
  }
}
