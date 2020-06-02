import { observable, action } from 'mobx';
import get from 'axios';
import { ILogEntry } from '../entry';
import { Constants } from '../App.constants';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { IWeightDTO } from '../weight';
import { ILifeEvent } from '../life-event';
import { ICalorieEntry } from '../calories';
import { KEYWORD_URL, TEXT_URL, WEIGHT_URL, LAST_DATES_URL } from '.';

export interface KeywordEntry {
  date: string;
  keywords: string[];
}

export interface Memory {
  date: string;
  text: string;
}

export interface ILastDates {
  first: string;
  last: string;
}

export class RootStore {
  @observable
  public isFetchingData = false;

  @observable
  public isSavingData = false;

  @observable
  public fetchingMemory: IPromiseBasedObservable<any> | undefined;

  @observable
  public fetchingWeight: IPromiseBasedObservable<any> | undefined;

  @observable
  public savingCalorieEntry: IPromiseBasedObservable<any> | undefined;

  @observable
  public fetchingKeywords: IPromiseBasedObservable<any> | undefined;

  @observable
  public fetchingDates: IPromiseBasedObservable<any> | undefined;

  @observable
  public keywords: KeywordEntry[] = [];

  @observable
  public memories: Memory[] = [];

  @observable
  public weights: IWeightDTO[] = [];

  @observable
  public lastDates: ILastDates = {
    first: '',
    last: '',
  };

  @action
  public async fetchKeywords() {
    this.fetchingKeywords = fromPromise(get(KEYWORD_URL));

    await this.fetchingKeywords.then(response => {
      console.log('fetched');
      this.setKeywords(response.data);
    });
  }

  @action.bound
  public async fetchMemory() {
    this.fetchingMemory = fromPromise(get(TEXT_URL));
    await this.fetchingMemory.then(response => {
      this.setMemories(response.data);
    });
  }

  @action.bound
  public async fetchWeightData() {
    this.isFetchingData = true;
    this.fetchingWeight = fromPromise(get(WEIGHT_URL));

    await this.fetchingWeight.then(response => {
      this.setWeight(response.data);
    });
  }

  @action.bound
  private setKeywords(keywords: any) {
    this.keywords = keywords;
  }

  @action.bound
  private setMemories(memories: any) {
    this.memories = memories;
  }

  @action.bound
  private setWeight(weights: any) {
    this.weights = weights;
  }

  @action.bound
  private setLastDates(dates: ILastDates) {
    this.lastDates = dates;
  }

  @action
  public async fetchLastDates() {
    this.fetchingDates = fromPromise(get(LAST_DATES_URL));

    await this.fetchingDates.then((response) => {
      console.log((response.data as ILastDates));
      this.setLastDates(response.data as ILastDates);
    });
  }

  public async saveCalorieEntry(entry: ICalorieEntry) {
    this.savingCalorieEntry = fromPromise(fetch(Constants.CALORIE_ENTRY_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry),
    }));
  }

  @action.bound
  public async saveLifeEvent(event: ILifeEvent) {
    return await fetch(Constants.LIFE_EVENT_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
    });
  }

  @action.bound
  private setSavingData(value: boolean) {
    this.isSavingData = value;
  }

  public saveEntry = async (data: ILogEntry) => {
    this.setSavingData(true);
    try {
      await fetch(Constants.DATABASE_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      this.setSavingData(false);
    }
    console.log(data);
  };
}

const rootStore = new RootStore();
export default rootStore;
