import moment, { Moment } from 'moment';

export const isDateDisabled = (date: Moment) => {
  const currDate = moment();
  return currDate < date;
};
