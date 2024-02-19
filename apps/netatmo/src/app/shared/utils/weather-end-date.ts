export function weatherEndDate(isoStr: string): string {
  const today = new Date();
  const date = new Date(isoStr);
  const endDate = new Date(today.setDate(today.getDate() + 5));
  if (date > endDate) {
    return endDate.toISOString().split('T')[0];
  }
  return isoStr.split('T')[0];
}
