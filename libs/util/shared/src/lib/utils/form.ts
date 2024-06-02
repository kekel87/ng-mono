import { FormArray } from '@angular/forms';

/**
 * Moves an item in a FormArray to another position.
 * https://material.angular.io/cdk/drag-drop/examples#cdk-drag-drop-sorting
 */
export function moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
  const dir = toIndex > fromIndex ? 1 : -1;

  const from = fromIndex;
  const to = toIndex;

  const temp = formArray.at(from);
  for (let i = from; i * dir < to * dir; i = i + dir) {
    const current = formArray.at(i + dir);
    formArray.setControl(i, current);
  }
  formArray.setControl(to, temp);
}
