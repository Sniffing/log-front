import { ICalorieEntry, ICalorieEntryFormValues } from '.';


export const convertFormValuesToCalorieEntry = (formValues: ICalorieEntryFormValues): ICalorieEntry => {
  return {
    calories: formValues.CALORIES,
    date: formValues.DATE?.unix(),
  };
};