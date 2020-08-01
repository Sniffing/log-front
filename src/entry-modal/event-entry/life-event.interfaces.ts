import { LifeEventFormFieldsEnum } from './life-event-form-fields';
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
  [LifeEventFormFieldsEnum.NAME]: string;
  [LifeEventFormFieldsEnum.DESCRIPTION]: string;
  [LifeEventFormFieldsEnum.DATE]: Moment;
  [LifeEventFormFieldsEnum.NATURE]: nature;
  [LifeEventFormFieldsEnum.INTENSITY]: number;
}
