import { observable, action } from 'mobx';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { RcFile } from 'antd/lib/upload';
import { CALORIE_FROM_FILE_URL, CALORIE_ENTRIES_URL } from './constants';
import get, { AxiosResponse } from 'axios';
import { ICalorieEntry } from '../entry-modal/calorie-entry';
import { BaseStore, BaseStoreProps } from './baseStore';
import { mockCalorieData } from './mockData/calorieStoreMocks';

export class CalorieStore extends BaseStore<ICalorieEntry>{

  public constructor(props: BaseStoreProps) {
    super(props);
  }

  @observable
  public fetchingCalories: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public savingCalorieEntry: IPromiseBasedObservable<Response> | undefined;

  @observable
  public calorieEntries: ICalorieEntry[] = [];

  public async save(entry: ICalorieEntry): Promise<void> {
    if (this.shouldMock) {
      console.log('Saving calorie entry', entry);
      return;
    }

    this.savingCalorieEntry = fromPromise(fetch(CALORIE_ENTRIES_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry),
    }));
  }

  public async saveCaloriesFromCSV(csvFile: RcFile): Promise<Response> {
    if (this.shouldMock) {
      console.log('saved', csvFile);
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile, 'calories.csv');

    return fetch(CALORIE_FROM_FILE_URL, {
      method: 'POST',
      body: formData,
    });
  }

  @action
  public async fetch(): Promise<void> {
    if (this.shouldMock) {
      this.setCalorieEntries(mockCalorieData);
      return;
    }

    this.fetchingCalories = fromPromise(get(CALORIE_ENTRIES_URL));
    await this.fetchingCalories.then((response: any) => {
      this.setCalorieEntries(response.data as ICalorieEntry[]);
    });
  }

  @action.bound
  private setCalorieEntries(entries: ICalorieEntry[]): void {
    this.calorieEntries = entries.sort((a,b) => a.date - b.date);
  }
}

