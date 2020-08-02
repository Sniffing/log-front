import { observable, action } from 'mobx';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { KEYWORD_URL, TEXT_URL, WEIGHT_URL, LAST_DATES_URL, LOG_ENTRY_URL } from '.';
import get, { AxiosResponse } from 'axios';
import { IWeightDTO } from '../App.interfaces';
import { ILogEntry } from '../entry-modal/log-entry';

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

export class LogEntryStore {
  @observable
  public fetchingMemory: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public fetchingWeight: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public fetchingKeywords: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public fetchingDates: IPromiseBasedObservable<AxiosResponse<ILastDates>> | undefined;

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

  @action.bound
  public setLatestDate(date: string) {
    this.lastDates.last = date;
  }

  @action
  public async fetchLastDates() {
    console.log('fetchin again');
    // this.fetchingDates = fromPromise(get(LAST_DATES_URL));
    this.fetchingDates = fromPromise(Promise.resolve({
      data: {
        last: '28-02-2018',
        first: '28-02-2018',
      },
      status: 45,
      statusText: 'test',
      headers: 'test',
      config: {
      },
    }));

    await this.fetchingDates.then((response) => {
      this.setLastDates(response.data as ILastDates);
    });
  }

  public saveEntry = async (data: ILogEntry) => {
    console.log('saving', data);
    // try {
    //   await fetch(LOG_ENTRY_URL, {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    //   });
    // } catch (error) {
    //   throw new Error(error);
    // }
  };
}