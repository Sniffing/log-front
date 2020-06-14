import { action, observable, computed } from 'mobx';
import get from 'axios';
import { ILifeEvent } from '../life-event';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { LIFE_EVENTS_URL } from '.';
import { AxiosResponse } from 'axios';

export class LifeEventStore {

  @observable
  public fetchingLifeEvents: IPromiseBasedObservable<AxiosResponse<any>> | undefined;

  @observable
  public savingLifeEvents: IPromiseBasedObservable<Response> | undefined;

  @observable
  public lifeEvents: ILifeEvent[] = [];

  @computed
  public get isSaving() {
    return this.savingLifeEvents?.state === 'pending';
  }

  @computed
  public get isFetching() {
    return this.fetchingLifeEvents?.state === 'pending';
  }

  @action.bound
  public async saveLifeEvent(event: ILifeEvent) {
    this.savingLifeEvents = fromPromise(fetch(LIFE_EVENTS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
    }));

    return await this.savingLifeEvents;
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