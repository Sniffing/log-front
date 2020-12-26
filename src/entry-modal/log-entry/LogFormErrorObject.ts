import { isEmpty, omitBy, isNil } from 'lodash';
import { observable, action } from 'mobx';
import { IFormItemError } from '../../App.interfaces';
import { LogFormObject } from './LogFormObject';

type LogFormKey = 'dateState' | 'entryMetricState' | 'keywordsState' | 'textState';
type FormKeys = Pick<LogFormObject, LogFormKey>
type Errors = {
  [K in keyof FormKeys]?: IFormItemError;
}

export class LogFormErrorObject {
  @observable
  private errors: Errors = {};

  public getFormItemError(key: LogFormKey): IFormItemError {
    return this.errors[key];
  }

  @action.bound
  public clear(): void {
    this.errors = {};
  }

  @action.bound
  public setError(key: LogFormKey, errorMsg: string): void {
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