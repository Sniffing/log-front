import { Utils } from '../../App.utils';
import { IWeightDTO } from '../../data-vis/analysis';
import { ILastDates, KeywordEntry, Memory } from '../logEntryStore';

export const mockLastDateData: ILastDates = {
  last: '2020-03-07',
  first: '2019-03-07',
};

const wordBank = ['tired', 'happy', 'sad', 'upset', 'excited', 'anxious'];
const randWeight = () => (Math.random() * (68 - 62)) + 62;
const randDate = () => Math.round(1563158685 - (Math.random() * 1232535) + (Math.random() * 12351)) * 1000;

export const mockKeywordData: KeywordEntry[] = Array.from({length: 50}, x => x).map(_ => {
  return {
    date: `${Utils.toReversedDate(new Date(randDate()))}`,
    keywords: Array.from(wordBank, x => {
      if (Math.random() > 0.3) {
        return x;
      }
    }).filter(x => x !== undefined),
  };
});

export const mockMemoryData: Memory[] = Array.from({length: 50}, x => x).map(_ => {
  return {
    date: `${Utils.toReversedDate(new Date(randDate()))}`,
    text: `Mock memory ${Math.random()}`,
  };
});

const addLastYear = () => {
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() -1);
  mockMemoryData.push({
    date: `${Utils.toReversedDate(lastYear)}`,
    text: 'Last year!'
  });
};
addLastYear();

let seedDate = randDate();
export const mockWeightData: IWeightDTO[] = Array.from({length: 50}, x => x).map(_ => {
  const day = 60 * 60 * 24 * 1000;
  seedDate += day;
  return {
    date: `${Utils.toReversedDate(new Date(seedDate))}`,
    weight: `${randWeight()}`,
  };
});