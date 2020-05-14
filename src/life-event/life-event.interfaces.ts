import { EventFormFieldsEnum } from './event-form-fields';
import { Moment } from 'moment';

export type nature = 'good' | 'bad';
export interface ILifeEvent {
  name: string;
  description?: string;
  date: number;
  nature?: nature;
  intensity: number; 
}

export interface ILifeEventFormValues {
  [EventFormFieldsEnum.NAME]: string;
  [EventFormFieldsEnum.DESCRIPTION]: string;
  [EventFormFieldsEnum.DATE]: Moment;
  [EventFormFieldsEnum.NATURE]: nature;
  [EventFormFieldsEnum.INTENSITY]: number;
}
