import * as React from 'react';
import { IFormProps } from '../App.interfaces';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';


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
  EventFormFieldsEnum.NATURE,
  EventFormFieldsEnum.INTENSITY,
  EventFormFieldsEnum.DESCRIPTION,
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
