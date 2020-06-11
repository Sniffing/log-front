import { IEntryFormValues, EntryFormFieldsEnum, ILogEntry } from '.';
import moment from 'moment';

export const defaultFormValues: IEntryFormValues = {
  [EntryFormFieldsEnum.DATE]: moment(),
  [EntryFormFieldsEnum.SET_EMOTIONS]: [],
  [EntryFormFieldsEnum.FREE_EMOTIONS]: []
};

export const dateFormat = 'DD-MM-YYYY';
export const booleanMetrics = ['happy', 'sad', 'sick', 'lonely', 'stressed', 'overate', 'dance', 'gym'];

export const convertLogEntryToFormValues = (logEntry?: ILogEntry): IEntryFormValues => {
  if (!logEntry) return defaultFormValues;

  const weight = logEntry.entryMetricState?.weight;

  return {
    [EntryFormFieldsEnum.DATE]: moment.utc(logEntry.dateState.date),
    [EntryFormFieldsEnum.SET_EMOTIONS]: logEntry.booleanMetricState
      ? Object.keys(logEntry.booleanMetricState)
      : [],
    [EntryFormFieldsEnum.FREE_EMOTIONS]: logEntry.keywordsState.keywords,
    ...(weight && { [EntryFormFieldsEnum.WEIGHT]: weight }),
    [EntryFormFieldsEnum.THOUGHTS]: logEntry.textState.data
  };
};

export const convertFormValuesToLogEntry = (
  values: IEntryFormValues
): ILogEntry => {
  return {
    dateState: {
      date: values.DATE.format(dateFormat)
    },
    entryMetricState: {
      ...(values.WEIGHT && { weight: values.WEIGHT })
    },
    keywordsState: {
      keywords: values.FREE_EMOTIONS || []
    },
    textState: {
      data: values.THOUGHTS || ''
    }
  };
};
