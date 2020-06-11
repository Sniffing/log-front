import { action, observable } from 'mobx';
import get from 'axios';
import { ILifeEvent } from '../life-event';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { LIFE_EVENTS_URL } from '.';
import { AxiosResponse } from 'axios';

export class LifeEventStore {

  @observable
  private fetchingLifeEvents: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public lifeEvents: ILifeEvent[] = [];

  @action.bound
  public async saveLifeEvent(event: ILifeEvent) {
    return await fetch(LIFE_EVENTS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
    });
  }

  @action.bound
  public async fetchLifeEvents() {
    this.fetchingLifeEvents = fromPromise(get(LIFE_EVENTS_URL));

    await this.fetchingLifeEvents.then((response) => {
      this.setLifeEvents(response.data as ILifeEvent[]);
    });
  }

  @action.bound
  public setLifeEvents(events: ILifeEvent[]) {
    this.lifeEvents = events;
  }
}