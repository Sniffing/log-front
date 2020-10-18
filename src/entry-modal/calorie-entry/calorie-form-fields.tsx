import { FormItemProps } from 'antd/lib/form';
import { generateFormLabel } from '../../App.utils';

export enum CalorieFormFieldsEnum {
  DATE = 'DATE',
  CALORIES = 'CALORIES',
  CSV = 'CSV',
}

export const eventFormFields = [
  CalorieFormFieldsEnum.DATE,
  CalorieFormFieldsEnum.CALORIES
];


export const CalorieFormFieldsConfigs: Record<CalorieFormFieldsEnum, FormItemProps> = {
  [CalorieFormFieldsEnum.DATE]: {
    id: CalorieFormFieldsEnum.DATE,
    label: generateFormLabel(CalorieFormFieldsEnum.DATE),
    rules: [
      {
        required: true,
        message: 'Mandatory field'
      }
    ]
  },
  [CalorieFormFieldsEnum.CALORIES]: {
    id: CalorieFormFieldsEnum.CALORIES,
    label: generateFormLabel(CalorieFormFieldsEnum.DATE),
    rules: [
      {
        required: true,
        message: 'Mandatory field'
      }
    ]
  },
  [CalorieFormFieldsEnum.CSV]: {
    id: CalorieFormFieldsEnum.CSV,
    label: undefined,
  }
};
