import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, HostListener, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'dropzone',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropzoneComponent,
      multi: true,
    },
  ],
})
export class DropzoneComponent implements ControlValueAccessor {
  accept = input.required<string[]>();
  multiple = input(false, { transform: coerceBooleanProperty });

  private files: File[] = [];
  private onTouched = (): void => {
    // CVA
  };
  private onChange = (_files: File[]): void => {
    // CVA
  };

  @HostListener('change', ['$event.target.files']) onSelectFiles(fileList: FileList) {
    this.files = Array.from(fileList);
    this.onTouched();
    this.onChange(this.files);
  }

  registerOnChange(fn: (_files: File[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  writeValue(files: File[]) {
    this.files = files;
  }
}
