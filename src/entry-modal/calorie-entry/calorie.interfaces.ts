import { CalorieFormFieldsEnum } from './calorie-form-fields';
import { Moment } from 'moment';

export interface ICalorieEntry {
  calories: number;
  date: number;
}

export interface ICalorieEntryFormValues {
  [CalorieFormFieldsEnum.CALORIES]: number;
  [CalorieFormFieldsEnum.DATE]: Moment;
}

export const calorieFormFields = [CalorieFormFieldsEnum.DATE, CalorieFormFieldsEnum.CALORIES];