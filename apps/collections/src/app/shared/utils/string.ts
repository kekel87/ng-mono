export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function removeSpaces(str: string): string {
  return str.replace(/ /g, '');
}

export function toPredicate(str: string): string {
  return removeDiacritics(removeSpaces(str)).toLowerCase();
}
