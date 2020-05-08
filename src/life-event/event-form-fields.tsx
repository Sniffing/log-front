import * as React from 'react';
import { IFormProps } from '../App.interfaces';


export enum EventFormFieldsEnum {
  DATE = 'DATE',
  NATURE = 'NATURE',
  INTENSITY = 'INTENSITY',
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
}

export const eventFormFields = [
  EventFormFieldsEnum.DATE,
  EventFormFieldsEnum.NAME,
  EventFormFieldsEnum.DESCRIPTION,
  EventFormFieldsEnum.NATURE,
  EventFormFieldsEnum.INTENSITY,
];

const generateFormLabel = (label: string) => (
  <span style={{ textTransform: 'capitalize' }}>{label.toLowerCase()}</span>
);

const getBaseConfig = (field: EventFormFieldsEnum): IFormProps => {
  return {
    id: field,
    name: field,
    label: generateFormLabel(field)
  };
};

export const EntryFormFieldsConfigs: Record<EventFormFieldsEnum, IFormProps> = {
  [EventFormFieldsEnum.DATE]: {
    ...getBaseConfig(EventFormFieldsEnum.DATE),
    required: true
  },
  [EventFormFieldsEnum.NAME]: {
    ...getBaseConfig(EventFormFieldsEnum.NAME),
    label: 'Event name',
    required: true
  },
  [EventFormFieldsEnum.DESCRIPTION]: {
    ...getBaseConfig(EventFormFieldsEnum.DESCRIPTION),
    label: 'Description'
  },
  [EventFormFieldsEnum.NATURE]: {
    ...getBaseConfig(EventFormFieldsEnum.NATURE),
    label: 'Nature'
  },
  [EventFormFieldsEnum.INTENSITY]: {
    ...getBaseConfig(EventFormFieldsEnum.INTENSITY),
    label: 'Event intensity',
    required: true
  }
};
