import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCalendarDay, faFileUpload, faUtensils} from '@fortawesome/free-solid-svg-icons';

export const EntryOptions = [
  {
    label: 'Event',
    className: 'firstChoice',
    icon: <FontAwesomeIcon icon={faCalendarDay}/>,
  },
  {
    label: 'Log',
    className: 'secondChoice',
    icon: <FontAwesomeIcon icon={faFileUpload}/>,
  },
  {
    label: 'Calorie',
    className: 'thirdChoice',
    icon: <FontAwesomeIcon icon={faUtensils}/>,
  }
];