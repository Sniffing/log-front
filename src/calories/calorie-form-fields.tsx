import * as React from 'react';
import { IFormProps } from '../App.interfaces';

export enum CalorieFormFieldsEnum {
  DATE = 'DATE',
  CALORIES = 'CALORIES',
}

export const eventFormFields = [
  CalorieFormFieldsEnum.DATE,
  CalorieFormFieldsEnum.CALORIES
];

const generateFormLabel = (label: string) => (
  <span style={{ textTransform: 'capitalize' }}>{label.toLowerCase()}</span>
);

const getBaseConfig = (field: CalorieFormFieldsEnum): IFormProps => {
  return {
    id: field,
    name: field,
    label: generateFormLabel(field)
  };
};

export const CalorieFormFieldsConfigs: Record<CalorieFormFieldsEnum, IFormProps> = {
  [CalorieFormFieldsEnum.DATE]: {
    ...getBaseConfig(CalorieFormFieldsEnum.DATE),
    required: true
  },
  [CalorieFormFieldsEnum.CALORIES]: {
    ...getBaseConfig(CalorieFormFieldsEnum.CALORIES),
    label: 'Calories',
    required: true
  }
};
