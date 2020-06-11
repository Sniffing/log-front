import { observable, action } from 'mobx';
import { Constants } from '../App.constants';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { ICalorieEntry } from '../calories';
import { RcFile } from 'antd/lib/upload';
import { CALORIE_FROM_FILE_URL } from './constants';
import get, { AxiosResponse } from 'axios';

export class CalorieStore {
  @observable
  public isFetchingCalories: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public savingCalorieEntry: IPromiseBasedObservable<Response> | undefined;

  public calorieEntries: ICalorieEntry[] = [];

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
    this.isFetchingCalories = fromPromise(get(Constants.CALORIE_ENTRY_URL));

    await this.isFetchingCalories.then((entries: any) => {
      this.setCalorieEntries(entries);
    });
  }

  @action.bound
  private setCalorieEntries(entries: ICalorieEntry[]) {
    this.calorieEntries = entries;
  }
}

