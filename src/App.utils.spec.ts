import { Utils } from './App.utils';

describe('Utils test', () => {
  describe('Unix time to date string', () => {
    it('converts correctly', () => {
      const date = Utils.unixTimeToDateString({ time: 1563177809 * 1000});
      expect(date).toEqual('15-07-2019');
    });

    it('converts correctly and divides', () => {
      const date = Utils.unixTimeToDateString({ time: 1524177809 * 1000, divider: '/'});
      expect(date).toEqual('19/04/2018');
    });
  });

  describe('Reversed date string to date', () => {
    it('converts correctly', () => {
      const date = Utils.displayStringfromReversedDate('2019-10-30');
      expect(date).toEqual('30 October 2019');
    });
  });

  describe('Normal date string to date', () => {
    it('converts correctly', () => {
      const date = Utils.dateFromReversedDateString('2020-11-25');
      expect(date).toEqual(new Date(2020,10,25));
    });

  });

  describe('Reversed date string to date string', () => {
    it('converts correctly', () => {
      const date = Utils.unreverseDateFromServer('2018-06-10');
      expect(date).toEqual('10-06-2018');
    });

  });

  describe('Date to reversed date string', () => {
    it('converts correctly', () => {
      const date = Utils.toReversedDate(new Date(2019,11,20));
      expect(date).toEqual('2019-12-20');
    });
  });

  describe('Combines reverse + display', () => {
    it('combines correctly', () => {
      const reverse = Utils.toReversedDate(new Date(2020,10,30));
      expect(reverse).toEqual('2020-11-30');
      const str = Utils.displayStringfromReversedDate(reverse);
      expect(str).toEqual('30 November 2020');
    });
  });
});

//hack to make file a module
export {};