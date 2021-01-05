import { ICalendarRange } from './feeling-calendar-keyword';

export const echartRangeFromCalendarRange = (range: ICalendarRange): string | string[] => {

  const {from, to} = range;
  const {year, month, day} = from;
  const fromDate = formEchartDate(year, month, day);

  if (to) {
    const {year: tYear, month: tMonth, day: tDay} = to;
    const toDate = formEchartDate(tYear, tMonth, tDay);

    return [fromDate, toDate];
  }

  return fromDate;
};

const formEchartDate = (y: number, m: number, d:number): string => {
  if (!m) {
    return `${y}`;
  }1;
  if (!d) {
    return `${y}-${('0'+ m).slice(-2)}`;
  }
  return `${y}-${('0'+ m).slice(-2)}-${('0'+ d).slice(-2)}`;
};

export const dateFromCalendarRange = (range: ICalendarRange): { from?: Date, to?: Date } => {
  const {from, to} = range;
  const {year, month, day} = from;

  const dateFrom = formDate(year, month, day);

  if (to) {
    const dateTo = formDate(to.year, to.month, to.day);
    return {
      from: dateFrom,
      to: dateTo,
    };
  }

  return {
    from: dateFrom
  };
};

const formDate = (year: number, month: number, day: number) => {
  if (!month) {
    return new Date(year, 0, 1);
  }
  if (!day) {
    return new Date(year, month-1, 1);
  } else {
    return new Date(year, month-1, day);
  }
};
