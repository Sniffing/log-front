import * as React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { generateFormLabel } from '../../App.utils';
import { FormItemProps } from 'antd/lib/form';


export enum LifeEventFormFieldsEnum {
  DATE = 'DATE',
  NATURE = 'NATURE',
  INTENSITY = 'INTENSITY',
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
}

export const EntryFormFieldsConfigs: Record<LifeEventFormFieldsEnum, FormItemProps> = {
  [LifeEventFormFieldsEnum.DATE]: {
    id: LifeEventFormFieldsEnum.DATE,
    label: generateFormLabel(LifeEventFormFieldsEnum.DATE),
    rules: [
      {
        required: true,
        message: 'Mandatory field'
      }
    ]
  },
  [LifeEventFormFieldsEnum.NAME]: {
    id: LifeEventFormFieldsEnum.NAME,
    label: 'Event name',
    rules: [
      {
        required: true,
        message: 'Mandatory field'
      }
    ]
  },
  [LifeEventFormFieldsEnum.DESCRIPTION]: {
    id: LifeEventFormFieldsEnum.DESCRIPTION,
    label: 'Description'
  },
  [LifeEventFormFieldsEnum.NATURE]: {
    id: LifeEventFormFieldsEnum.NATURE,
    label: generateFormLabel(LifeEventFormFieldsEnum.NATURE)
  },
  [LifeEventFormFieldsEnum.INTENSITY]: {
    id: LifeEventFormFieldsEnum.INTENSITY,
    label:
      <Tooltip title={'10 should be huge say hospitalised vs getting married 5 is medium such as switched jobs 1 is a minor struggle that would cause stress, e.g. moving house'}>
        <span>
        Intensity {' '}
          <InfoCircleOutlined />
        </span>
      </Tooltip>,
    rules: [
      {
        required: true,
        message: 'Mandatory field'
      }
    ]
  }
};
