import { ILifeEvent } from '../../entry-modal/event-entry';

export const mockLifeEventData: ILifeEvent[] =
 [...Array(50).keys()].map(k =>
 {
   return {
     name: `Mock event ${k}`,
     description: `Mock description ${k}`,
     intensity: Math.round(Math.random() * 10),
     nature: Math.random() > 0.5 ? 'good' : 'bad',
     date: 1563158685 - (Math.random() * 132535) + (Math.random() * 142351),
   };
 }
 );