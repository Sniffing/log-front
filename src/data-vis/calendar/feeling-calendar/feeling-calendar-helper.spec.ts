import { dateFromCalendarRange, echartRangeFromCalendarRange } from './feeling-calendar-helper';
import { ICalendarRange } from './feeling-calendar-keyword';

describe('Feeling calendar', () => {
  describe('dateFromCalendarRange', () => {
    it('Converts to correct year', () => {
      const range: ICalendarRange = {
        from: {year: 2011},
      };
      const {to, from} = dateFromCalendarRange(range);
      expect(to).toEqual(undefined);
      expect(from).toEqual(new Date(2011,0,1));
    });

    it('Converts to correct year', () => {
      const range: ICalendarRange = {
        from: {year: 2011, month: 10, day: 12},
      };
      const {to, from} = dateFromCalendarRange(range);
      expect(to).toEqual(undefined);
      expect(from).toEqual(new Date(2011,9,12));
    });

    it('Converts to correct year', () => {
      const range: ICalendarRange = {
        from: {year: 2011},
        to: {year: 2013},
      };
      const {to, from} = dateFromCalendarRange(range);
      expect(to).toEqual(new Date(2013,0,1));
      expect(from).toEqual(new Date(2011,0,1));
    });

    it('Ignores day if no month', () => {
      const range: ICalendarRange = {
        from: {year: 2011, day: 22},
      };
      const {to, from} = dateFromCalendarRange(range);
      expect(to).toEqual(undefined);
      expect(from).toEqual(new Date(2011,0,1));
    });
  });

  describe('echartRangeFromCalendarRange', () => {
    it('returns single year',() => {
      const range: ICalendarRange = {
        from: {
          year: 2018,
        }
      };

      const eRange = echartRangeFromCalendarRange(range);
      expect(eRange).toEqual('2018');
    });

    it('returns doesnt register day if no month',() => {
      const range: ICalendarRange = {
        from: {
          year: 2018,
          day: 8
        },
      };

      const eRange = echartRangeFromCalendarRange(range);
      expect(eRange).toEqual('2018');
    });


    it('returns year range',() => {
      const range: ICalendarRange = {
        from: {
          year: 2018,
        },
        to: {
          year: 2020,
        }
      };

      const eRange = echartRangeFromCalendarRange(range);
      expect(eRange).toEqual(['2018','2020']);
    });

    it('returns single month',() => {
      const range: ICalendarRange = {
        from: {
          year: 2018, month: 4
        }
      };

      const eRange = echartRangeFromCalendarRange(range);
      expect(eRange).toEqual('2018-04');
    });

    it('returns month range',() => {
      const range: ICalendarRange = {
        from: {
          year: 2018, month: 4
        },
        to: {
          year: 2019, month: 3
        }
      };

      const eRange = echartRangeFromCalendarRange(range);
      expect(eRange).toEqual(['2018-04','2019-03']);
    });

    it('returns date range',() => {
      const range: ICalendarRange = {
        from: {
          year: 2018, month: 4, day:23
        },
        to: {
          year: 2019, month: 3, day: 9
        }
      };

      const eRange = echartRangeFromCalendarRange(range);
      expect(eRange).toEqual(['2018-04-23','2019-03-09']);
    });
  });

});

export {};