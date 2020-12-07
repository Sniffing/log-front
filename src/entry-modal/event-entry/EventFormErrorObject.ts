import { isEmpty, omitBy, isNil } from 'lodash';
import { observable, action } from 'mobx';
import { IFormItemError } from '../../App.interfaces';
import { EventFormObject } from './EventFormObject';

type EventFormKey = 'name' | 'date' | 'description' | 'nature' | 'intensity';
type FormKeys = Pick<EventFormObject, EventFormKey>
type Errors = {
  [K in keyof FormKeys]?: IFormItemError;
}

export class EventFormErrorObject {
  @observable
  private errors: Errors = {};

  public getFormItemError(key: EventFormKey): IFormItemError {
    return this.errors[key];
  }

  @action.bound
  public clear() {
    this.errors = {};
  }

  @action.bound
  public setError(key: EventFormKey, errorMsg: string) {
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