import { CalorieFormObject } from './CalorieFormObject';
import {IFormItemError} from '../../App.interfaces';
import { action, observable } from 'mobx';
import { isEmpty, isNil, omitBy } from 'lodash';

type CalorieFormKey = 'calories' | 'date' | 'csvFile';
type FormKeys = Pick<CalorieFormObject, CalorieFormKey>
type Errors = {
  [K in keyof FormKeys]?: IFormItemError;
}

export class CalorieFormErrorObject {
  @observable
  private errors: Errors = {};

  public getFormItemError(key: CalorieFormKey): IFormItemError {
    return this.errors[key];
  }

  @action.bound
  public clear(): void {
    this.errors = {};
  }

  @action.bound
  public setError(key: CalorieFormKey, errorMsg: string): void {
    if (!errorMsg) {
      delete this.errors[key];
      return;
    }

    this.errors[key] = {
      help: errorMsg,
      validateStatus: 'error'
    };
  }

  public get hasErrors(): boolean {
    return !isEmpty(omitBy(this.errors, isNil));
  }
}