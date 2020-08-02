import { CalorieFormFieldsEnum } from './calorie-form-fields';
import { Moment } from 'moment';
import { RcFile } from 'antd/lib/upload';

export interface ICalorieEntry {
  calories: number;
  date: number;
}

export interface ICalorieEntryFormValues {
  [CalorieFormFieldsEnum.CALORIES]: number;
  [CalorieFormFieldsEnum.DATE]: Moment;
  [CalorieFormFieldsEnum.CSV]: RcFile;
}

export const calorieFormFields = [CalorieFormFieldsEnum.DATE, CalorieFormFieldsEnum.CALORIES];

export enum ECalorieEntryTabs {
  CSV = 'CSV',
  FORM = 'FORM'
}