import { action, observable } from 'mobx';
import {ILifeEvent, Nature} from '.';

export class EventFormObject implements ILifeEvent {

  @observable
  public name: string;

  @observable
  public description: string;

  @observable
  public date: number;

  @observable
  public nature: Nature;

  @observable
  public intensity: number;

  public get lifeEvent(): ILifeEvent {
    return {
      name: this.name,
      description: this.description,
      date: this.date,
      nature: this.nature,
      intensity: this.intensity,
    };
  }

  @action.bound
  public setName(name: string): void {
    this.name = name;
  }

  @action.bound
  public setDescription(desc: string): void {
    this.description = desc;
  }

  @action.bound
  public setDate(date: number): void {
    this.date = date;
  }

  @action.bound
  public setNature(nature: Nature): void {
    this.nature = nature;
  }

  @action.bound
  public setIntensity(intenstiy: number): void {
    this.intensity = intenstiy;
  }
}