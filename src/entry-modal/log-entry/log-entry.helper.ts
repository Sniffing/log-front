import { IEntryFormValues, ILogEntry } from '.';


export const dateFormat = 'DD-MM-YYYY';
export const booleanMetrics = ['happy', 'sad', 'sick', 'lonely', 'stressed', 'overate', 'dance', 'gym'];

// export const convertFormValuesToLogEntry = (
//   values: IEntryFormValues
// ): ILogEntry => {
//   return {
//     dateState: {
//       date: values.DATE.format(dateFormat)
//     },
//     entryMetricState: {
//       ...(values.WEIGHT && { weight: values.WEIGHT })
//     },
//     keywordsState: {
//       keywords: values.FREE_EMOTIONS || []
//     },
//     textState: {
//       data: values.THOUGHTS || ''
//     }
//   };
// };
