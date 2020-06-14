import { observable, action } from 'mobx';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { ICalorieEntry } from '../calories';
import { RcFile } from 'antd/lib/upload';
import { CALORIE_FROM_FILE_URL, CALORIE_ENTRIES_URL } from './constants';
import get, { AxiosResponse } from 'axios';

export class CalorieStore {
  @observable
  public fetchingCalories: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public savingCalorieEntry: IPromiseBasedObservable<Response> | undefined;

  @observable
  public calorieEntries: ICalorieEntry[] = [];

  public async saveCalorieEntry(entry: ICalorieEntry) {
    this.savingCalorieEntry = fromPromise(fetch(CALORIE_ENTRIES_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry),
    }));
  }

  public async saveCaloriesFromCSV(csvFile: RcFile) {
    const formData = new FormData();
    formData.append('file', csvFile, 'calories.csv');

    return fetch(CALORIE_FROM_FILE_URL, {
      method: 'POST',
      body: formData,
    });
  }

  @action
  public async fetchCalorieEntries() {
    this.fetchingCalories = fromPromise(get(CALORIE_ENTRIES_URL));

    await this.fetchingCalories.then((response: any) => {
      this.setCalorieEntries(response.data as ICalorieEntry[]);
    });
  }

  @action.bound
  private setCalorieEntries(entries: ICalorieEntry[]) {
    this.calorieEntries = entries;
  }
}

