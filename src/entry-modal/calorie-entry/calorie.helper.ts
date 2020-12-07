import moment from 'moment';
import { Moment } from 'moment';

export const isDateDisabled = (date: Moment) => {
  const currDate = moment();
  return currDate < date;
};
