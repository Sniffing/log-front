import * as React from 'react';
import { IFormProps } from '../../App.interfaces';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { generateFormLabel } from '../../App.utils';


export enum LifeEventFormFieldsEnum {
  DATE = 'DATE',
  NATURE = 'NATURE',
  INTENSITY = 'INTENSITY',
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
}

export const eventFormFields = [
  LifeEventFormFieldsEnum.DATE,
  LifeEventFormFieldsEnum.NAME,
  LifeEventFormFieldsEnum.NATURE,
  LifeEventFormFieldsEnum.INTENSITY,
  LifeEventFormFieldsEnum.DESCRIPTION,
];

const getBaseConfig = (field: LifeEventFormFieldsEnum): IFormProps => {
  return {
    id: field,
    name: field,
    label: generateFormLabel(field)
  };
};

export const EntryFormFieldsConfigs: Record<LifeEventFormFieldsEnum, IFormProps> = {
  [LifeEventFormFieldsEnum.DATE]: {
    ...getBaseConfig(LifeEventFormFieldsEnum.DATE),
    required: true
  },
  [LifeEventFormFieldsEnum.NAME]: {
    ...getBaseConfig(LifeEventFormFieldsEnum.NAME),
    label: 'Event name',
    required: true
  },
  [LifeEventFormFieldsEnum.DESCRIPTION]: {
    ...getBaseConfig(LifeEventFormFieldsEnum.DESCRIPTION),
    label: 'Description'
  },
  [LifeEventFormFieldsEnum.NATURE]: {
    ...getBaseConfig(LifeEventFormFieldsEnum.NATURE),
    label: 'Nature'
  },
  [LifeEventFormFieldsEnum.INTENSITY]: {
    ...getBaseConfig(LifeEventFormFieldsEnum.INTENSITY),
    label:
      <Tooltip title={'10 should be huge say hospitalised vs getting married 5 is medium such as switched jobs 1 is a minor struggle that would cause stress, e.g. moving house'}>
        <span>
        Intensity {' '}
          <InfoCircleOutlined />
        </span>
      </Tooltip>,
    required: true
  }
};
