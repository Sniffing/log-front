import { Utils } from '../../App.utils';
import { IWeightDTO } from '../../data-vis/analysis';
import { ILastDates, KeywordEntry, Memory } from '../logEntryStore';

export const mockLastDateData: ILastDates = {
  last: '07-03-2020',
  first: '07-03-2019',
};

const wordBank = ['tired', 'happy', 'sad', 'upset', 'excited', 'anxious'];
const randWeight = () => (Math.random() * (68 - 62)) + 62;
const randDate = () => Math.round(1563158685 - (Math.random() * 1232535) + (Math.random() * 12351)) * 1000;

export const mockKeywordData: KeywordEntry[] = Array.from({length: 50}, x => x).map(i => {
  return {
    date: `${Utils.toReversedDate(new Date(randDate()))}`,
    keywords: Array.from(wordBank, x => {
      if (Math.random() > 0.5) {
        return x;
      }
    }).filter(x => x !== undefined),
  };
});

export const mockMemoryData: Memory[] = Array.from({length: 50}, x => x).map(i => {
  return {
    date: `${Utils.toReversedDate(new Date(randDate()))}`,
    text: `Mock memory ${Math.random()}`,
  };
});

export const mockWeightData: IWeightDTO[] = Array.from({length: 50}, x => x).map(i => {
  return {
    date: `${Utils.toReversedDate(new Date(randDate()))}`,
    weight: `${randWeight()}`,
  };
});