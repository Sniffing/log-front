import { action, observable, computed } from 'mobx';
import get from 'axios';
import { IPromiseBasedObservable, fromPromise } from 'mobx-utils';
import { LIFE_EVENTS_URL } from '.';
import { AxiosResponse } from 'axios';
import { ILifeEvent } from '../entry-modal/event-entry';
import { BaseStore, BaseStoreProps } from './baseStore';
import { mockLifeEventData } from './mockData/lifeEventStoreMocks';

export class LifeEventStore extends BaseStore<ILifeEvent>{

  public constructor(props: BaseStoreProps) {
    super(props);
  }

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
  public async save(event: ILifeEvent) {
    if (this.shouldMock) {
      console.log('Saving life event', event);
      return;
    }

    this.savingLifeEvents = fromPromise(fetch(LIFE_EVENTS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
    }));

    await this.savingLifeEvents;
  }

  @action.bound
  public async fetch() {
    if (this.shouldMock) {
      this.setLifeEvents(mockLifeEventData);
      return;
    }

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