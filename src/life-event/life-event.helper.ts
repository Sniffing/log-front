import { ILifeEventFormValues } from './life-event.component';
import { ILifeEvent } from './life-event.interfaces';

export const convertFormValuesToLifeEvent = (formValues: ILifeEventFormValues): ILifeEvent => {
  return {
    name: formValues.NAME,
    description: formValues.DESCRIPTION,
    date: formValues.DATE?.unix(),
    nature: formValues.NATURE,
    intensity: formValues.INTENSITY,
  };
};