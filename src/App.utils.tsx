import moment from 'moment';
import { Moment } from 'moment';
import React from 'react';

interface IUnixTimeToDateParam {
  time: number;
  divider?: string;
}

export class Utils {
  public static unixTimeToDateString({time, divider = '-'}: IUnixTimeToDateParam) {
    const date = new Date(time);
    return `${('0' + date.getDate()).slice(-2)}${divider}${('0' + (date.getMonth()+1)).slice(-2)}${divider}${date.getFullYear()}`;
  }


  public static displayStringfromReversedDate(date: string) {
    const parsedDate: Date = Utils.dateFromReversedDateString(date);

    return `${parsedDate.getDate()} ${parsedDate.toLocaleDateString('default', { month: 'long' })} ${parsedDate.getFullYear()}`;
  }

  public static dateFromReversedDateString(date: string) {
    const dateParts = date.split('-');

    if (dateParts.length !== 3) return new Date();

    return new Date(`${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`);
  }

  public static unreverseDateFromServer(date: string) {
    const dateParts = date.split('-');
    //TODO: This shouldn't ever hit this is lazy solution
    if (dateParts.length !== 3) return new Date().toString();

    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  public static toReversedDate(date: Date) {
    return `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
  }
}

export const generateFormLabel = (label: string) => (
  <span style={{ textTransform: 'capitalize' }}>{label.toLowerCase()}</span>
);

export const isDateDisabled = (date: Moment) => {
  const currDate = moment();
  return currDate < date;
};
