export type Nature = 'good' | 'bad';
export interface ILifeEvent {
  name: string;
  description?: string;
  date: number;
  nature?: Nature;
  intensity: number;
}