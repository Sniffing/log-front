import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCalendarDay, faFileUpload, faUtensils} from '@fortawesome/free-solid-svg-icons';

export enum EntryType {
  EVENT = 'EVENT',
  LOG = 'LOG',
  CALORIE = 'CALORIE'
}

export interface IEntryOption {
  label: EntryType;
  className: string;
  icon: JSX.Element;
}

export const EntryOptions: IEntryOption[] = [
  {
    label: EntryType.EVENT,
    className: 'firstChoice',
    icon: <FontAwesomeIcon icon={faCalendarDay}/>,
  },
  {
    label: EntryType.LOG,
    className: 'secondChoice',
    icon: <FontAwesomeIcon icon={faFileUpload}/>,
  },
  {
    label: EntryType.CALORIE,
    className: 'thirdChoice',
    icon: <FontAwesomeIcon icon={faUtensils}/>,
  }
];