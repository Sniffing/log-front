import { WeightPage } from '../weight';
import { KeywordPage } from '../keywords';
import { CalendarPage } from '../calendar';
import { MemoryPage } from '../memory';
import { EntryPage } from '../entry';
import { Analysis } from '../analysis';
import React from 'react';
import { LifeEventsPage } from '../life-event';

export enum Page {
  WEIGHT = 'WEIGHT',
  FEELINGS = 'FEELINGS',
  CALENDAR = 'CALENDAR',
  MEMORY = 'MEMORY',
  ENTRY = 'ENTRY',
  LIFE_EVENT = 'LIFE_EVENT',
  ANALYSIS = 'ANALYSIS',
}

export const pageDisplayNames: Record<Page, string> = {
  [Page.WEIGHT]: 'Weight',
  [Page.FEELINGS]: 'Feelings',
  [Page.CALENDAR]: 'Feelings Calendar',
  [Page.MEMORY]: 'Memories',
  [Page.ENTRY]: 'Log Entry',
  [Page.LIFE_EVENT]: 'Life Events',
  [Page.ANALYSIS]: 'Analysis charts',
};

export interface IPageConfig {
  page: Page;
  path: string;
  component: React.ComponentClass;
  icon: JSX.Element;
}

const getComponent = (page: Page): React.ComponentClass => {
  switch(page) {
  case Page.WEIGHT: return WeightPage;
  case Page.FEELINGS: return KeywordPage;
  case Page.CALENDAR: return CalendarPage;
  case Page.MEMORY: return MemoryPage;
  case Page.ENTRY: return EntryPage;
  case Page.LIFE_EVENT: return LifeEventsPage;
  case Page.ANALYSIS: return Analysis;
  }
};

const PageIconMap: Record<Page, JSX.Element> = {
  [Page.WEIGHT]: <i className="fa fa-line-chart" aria-hidden="true"></i>,
  [Page.FEELINGS]: <i className="fa fa-pie-chart" aria-hidden="true"></i>,
  [Page.CALENDAR]: <i className="fa fa-calendar" aria-hidden="true"></i>,
  [Page.MEMORY]: <i className="fa fa-commenting-o" aria-hidden="true"></i>,
  [Page.ENTRY]: <i className="fa fa-cloud-upload" aria-hidden="true"></i>,
  [Page.LIFE_EVENT]: <i className="fa fa-exclamation" aria-hidden="true"></i>,
  [Page.ANALYSIS]: <i className="fa fa-bar-chart" aria-hidden="true"></i>,
};

export const pageConfigs: IPageConfig[] = Object.values(Page).map((page: Page) => {
  const comp = getComponent(page);

  return {
    page: page,
    path: `/${page.toString()}`,
    component: comp,
    icon: PageIconMap[page],
  };
});