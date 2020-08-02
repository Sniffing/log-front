import { IFormProps } from '../../App.interfaces';
import { generateFormLabel } from '../../App.utils';


export enum EntryFormFieldsEnum {
  DATE = 'DATE',
  FREE_EMOTIONS = 'FREE_EMOTIONS',
  WEIGHT = 'WEIGHT',
  THOUGHTS = 'THOUGHTS'
}

export const entryFormFields = Object.values(EntryFormFieldsEnum);

const getBaseConfig = (field: EntryFormFieldsEnum): IFormProps => {
  return {
    key: field,
    name: field,
    label: generateFormLabel(field)
  };
};

export const EntryFormFieldsConfigs: Record<EntryFormFieldsEnum, IFormProps> = {
  [EntryFormFieldsEnum.DATE]: {
    ...getBaseConfig(EntryFormFieldsEnum.DATE),
    required: true
  },
  [EntryFormFieldsEnum.FREE_EMOTIONS]: {
    ...getBaseConfig(EntryFormFieldsEnum.FREE_EMOTIONS),
    label: 'Feelings'
  },
  [EntryFormFieldsEnum.WEIGHT]: {
    ...getBaseConfig(EntryFormFieldsEnum.WEIGHT)
  },
  [EntryFormFieldsEnum.THOUGHTS]: {
    ...getBaseConfig(EntryFormFieldsEnum.THOUGHTS),
    required: true
  }
};
