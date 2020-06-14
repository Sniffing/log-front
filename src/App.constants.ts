import { KeywordPage } from './keywords';
import { EntryPage } from './entry';
import { MemoryPage } from './memory';
import { WeightPage } from './weight';
import { CalendarPage } from './calendar';
import { LifeEventEntryPage } from './life-event';
import { CalorieEntryPage } from './calories';
import { Analysis } from './analysis';
import { LifeEventsListPage } from './life-event/life-events-list';

export enum Page {
    WEIGHT = 'WEIGHT',
    FEELINGS = 'FEELINGS',
    CALENDAR = 'CALENDAR',
    MEMORY = 'MEMORY',
    ENTRY = 'ENTRY',
    LIFE_EVENT = 'LIFE_EVENT',
    LIFE_EVENT_ENTRY = 'LIFE_EVENT_ENTRY',
    CALORIE_ENTRY = 'CALORIE_ENTRY',
    ANALYSIS = 'ANALYSIS',
}

export const pageDisplayNames: Record<Page, string> = {
  [Page.WEIGHT]: 'Weight',
  [Page.FEELINGS]: 'Feelings',
  [Page.CALENDAR]: 'Feelings Calendar',
  [Page.MEMORY]: 'Memories',
  [Page.ENTRY]: 'Log Entry',
  [Page.LIFE_EVENT]: 'Life Events',
  [Page.LIFE_EVENT_ENTRY]: 'Life Event Entry',
  [Page.CALORIE_ENTRY]: 'Calorie Entry',
  [Page.ANALYSIS]: 'Analysis charts',
};

export interface IPageConfig {
    page: Page;
    path: string;
    component: any;
}

const getComponent = (page: Page) => {
  switch(page) {
  case Page.WEIGHT: return WeightPage;
  case Page.FEELINGS: return KeywordPage;
  case Page.CALENDAR: return CalendarPage;
  case Page.MEMORY: return MemoryPage;
  case Page.ENTRY: return EntryPage;
  case Page.LIFE_EVENT: return LifeEventsListPage;
  case Page.LIFE_EVENT_ENTRY: return LifeEventEntryPage;
  case Page.CALORIE_ENTRY: return CalorieEntryPage;
  case Page.ANALYSIS: return Analysis;
  }
};

const pageConfigs: IPageConfig[] = Object.values(Page).map((page: Page) => {
  const comp = getComponent(page);

  return {
    page: page,
    path: `/${page.toString()}`,
    component: comp,
  };
});

export class Constants {
    public static pageConfigs = pageConfigs;
    public static DATABASE_URL='http://localhost:3000';
    public static LOG_ENTRY_URL=`${Constants.DATABASE_URL}/logEntries`;
    public static LIFE_EVENT_URL=`${Constants.DATABASE_URL}/lifeEvents`;
    public static CALORIE_ENTRY_URL=`${Constants.DATABASE_URL}/calories`;
}