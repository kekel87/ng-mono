enum MeasureType {
  Temperature = 'Temperature',
  Humidity = 'Humidity',
}
interface MeasureSource extends Partial<Record<MeasureType, number>> {
  id: string;
  timestamp: string;
}

export function resample(input: MeasureSource[], startDateStr: string, endDateStr: string, scale: string): MeasureSource[] {
  const startDate = new Date(startDateStr);
  const sampleTime = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  console.log('🚪 input', input);
  console.log('🏁 startDate', startDate);
  console.log('🏁 endDate', endDate);
  console.log('🪜 scale', scale);

  const dates = input.map((i) => ({ ...i, date: new Date(i.timestamp) })).sort((a, b) => b.date.getTime() - a.date.getTime());
  console.log('🧪 dates', dates);

  const samples: Date[] = [];
  while (sampleTime < endDate) {
    samples.push(new Date(sampleTime));
    sampleTime.setTime(sampleTime.getTime() + 30 * 60 * 1000);
  }

  console.log('🧪 samples', samples);

  const l = input.length;
  const sampled = [] as MeasureSource[];
  // always add the first point
  sampled.push(input[0]);

  const prev_date_index = dates.findIndex(({ date }) => date.getTime() - samples[0].getTime() <= 0);
  const prev_date = dates[prev_date_index];
  const next_date = dates[prev_date_index + 1];

  console.log('prev_date', prev_date);
  console.log('next_date', next_date);

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const threshold = sampled.length;

  dates.forEach((_, index) => {
    const delta = (index / (threshold - 2)) * (l - 2);
    const left = Math.floor(delta);
    const right = Math.min(Math.ceil(delta), l - 1);

    console.log('left', left);
    console.log('right', right);

    const a = delta - left;
    const value = lerp(dates[left].Temperature!, dates[right].Temperature!, a);
    const time = Math.floor(lerp(dates[left].date.getTime(), dates[right].date.getTime(), a));
    sampled.push({ Temperature: value, timestamp: new Date(time).toISOString(), id: 'weather_id' });
  });

  sampled.push(input[l - 1]);
  return sampled;
}
