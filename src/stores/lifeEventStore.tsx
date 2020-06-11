import { action } from 'mobx';
import { ILifeEvent } from '../life-event';
import { Constants } from '../App.constants';

export class LifeEventStore {
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
}