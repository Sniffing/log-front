import { Constants } from '../App.constants';
import { CalorieStore } from './calorieStore';
import { LogEntryStore } from './logEntryStore';
import { LifeEventStore } from './lifeEventStore';

export const KEYWORD_URL = Constants.LOG_ENTRY_URL+'/keywords';
export const TEXT_URL = Constants.LOG_ENTRY_URL+'/texts';
export const WEIGHT_URL = Constants.LOG_ENTRY_URL+'/weights';
export const LOG_ENTRY_URL = Constants.LOG_ENTRY_URL;
export const LAST_DATES_URL = Constants.LOG_ENTRY_URL;

export const LIFE_EVENTS_URL = Constants.LIFE_EVENT_URL;

export const CALORIE_ENTRIES_URL = Constants.CALORIE_ENTRY_URL;
export const CALORIE_FROM_FILE_URL = Constants.CALORIE_ENTRY_URL+'/upload';

export const LOCAL_URL = Constants.DATABASE_URL;

const generateStores = () => {
  const calorieStore = new CalorieStore();
  const logEntryStore = new LogEntryStore();
  const lifeEventStore = new LifeEventStore();

  return {
    calorieStore,
    logEntryStore,
    lifeEventStore,
  };
};

export const allStores = generateStores();