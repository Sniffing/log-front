import { FormItemProps } from 'antd/lib/form';
import { generateFormLabel } from '../../App.utils';

export enum EntryFormFieldsEnum {
  DATE = 'DATE',
  FREE_EMOTIONS = 'FREE_EMOTIONS',
  WEIGHT = 'WEIGHT',
  THOUGHTS = 'THOUGHTS'
}

export const EntryFormFieldsConfigs: Record<EntryFormFieldsEnum, FormItemProps> = {
  [EntryFormFieldsEnum.DATE]: {
    id: EntryFormFieldsEnum.DATE,
    label: generateFormLabel(EntryFormFieldsEnum.DATE),
    rules: [
      {
        required: true,
        message: 'Mandatory field'
      }
    ]
  },
  [EntryFormFieldsEnum.FREE_EMOTIONS]: {
    id: EntryFormFieldsEnum.FREE_EMOTIONS,
    label: 'Feelings'
  },
  [EntryFormFieldsEnum.WEIGHT]: {
    id: EntryFormFieldsEnum.WEIGHT,
    label: generateFormLabel(EntryFormFieldsEnum.WEIGHT),
  },
  [EntryFormFieldsEnum.THOUGHTS]: {
    id: EntryFormFieldsEnum.THOUGHTS,
    label: generateFormLabel(EntryFormFieldsEnum.THOUGHTS),
    rules: [
      {
        required: true,
        message: 'Mandatory field'
      }
    ]
  }
};
