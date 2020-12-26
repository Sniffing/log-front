import { RcFile } from 'antd/lib/upload';
import { action, observable } from 'mobx';
import { ICalorieEntry } from './calorie.interfaces';

export class CalorieFormObject implements ICalorieEntry {
  @observable
  public calories: number;

  @observable
  public date: number;

  @observable
  public csvFile: RcFile;

  public get calorieEntry(): ICalorieEntry {
    return {
      calories: this.calories,
      date: this.date,
    };
  }

  @action.bound
  public setCSV(csv: RcFile): void {
    this.csvFile = csv;
  }

  @action.bound
  public setCalories(calories: number): void {
    this.calories = calories;
  }

  @action.bound
  public setDate(date: number): void {
    this.date = date;
  }

  @action.bound
  public clearEntryFields(): void {
    this.calories = undefined;
    this.date = undefined;
  }

  @action.bound
  public clearCSVFile(): void {
    this.csvFile = undefined;
  }

}