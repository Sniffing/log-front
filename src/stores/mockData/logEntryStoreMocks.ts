import moment from 'moment';
import { IWeightDTO } from '../../data-vis/analysis';
import { dateFormat } from '../../entry-modal/log-entry';
import { ILastDates, KeywordEntry, Memory } from '../logEntryStore';

export const mockLastDateData: ILastDates = {
  last: '07-03-2020',
  first: '07-03-2019',
};

const wordBank = ['tired', 'happy', 'sad', 'upset', 'excited', 'anxious'];
const randWeight = () => (Math.random() * (68 - 62)) + 62;
const randDate = () => 1563158685 - (Math.random() * 132535) + (Math.random() * 142351);

export const mockKeywordData: KeywordEntry[] = Array.from({length: 50}, x => x).map(i => {
  return {
    date: `${moment(randDate(), dateFormat)}`,
    keywords: Array.from(wordBank, x => {
      if (Math.random() > 0.5) {
        return x;
      }
    }).filter(x => x !== undefined),
  };
});

export const mockMemoryData: Memory[] = Array.from({length: 50}, x => x).map(i => {
  return {
    date: `${moment(randDate(), dateFormat)}`,
    text: `Mock memory ${Math.random()}`,
  };
});

export const mockWeightData: IWeightDTO[] = Array.from({length: 50}, x => x).map(i => {
  return {
    date: `${moment(randDate(), dateFormat)}`,
    weight: `${randWeight()}`,
  };
});