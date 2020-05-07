import { KeywordPage } from './keywords';
import { Home } from './pages';
import { EntryPage } from './entry';
import { MemoryPage } from './memory';
import { WeightPage } from './weight';
import { CalendarPage } from './calendar';

export enum Page {
    HOME = 'HOME',
    WEIGHT = 'WEIGHT',
    KEYWORDS = 'KEYWORDS',
    CALENDAR = 'CALENDAR',
    MEMORY = 'MEMORY',
    ENTRY = 'ENTRY',
}
export interface IPageConfig {
    page: string;
    path: string;
    component: any;
}

const getComponent = (page: Page) => {
  switch(page) {
  case Page.HOME: return Home;
  case Page.WEIGHT: return WeightPage;
  case Page.KEYWORDS: return KeywordPage;
  case Page.CALENDAR: return CalendarPage;
  case Page.MEMORY: return MemoryPage;
  case Page.ENTRY: return EntryPage;
  }
};

const pageConfigs: IPageConfig[] = Object.values(Page).map((page: Page) => {
  const comp = getComponent(page);
    
  return {
    page: page.toString(),
    path: `/${page.toString().toLowerCase()}`,
    component: comp,
  };
});

export class Constants {
    public static pageConfigs = pageConfigs;
    public static DATABASE_URL='http://localhost:3000';
}