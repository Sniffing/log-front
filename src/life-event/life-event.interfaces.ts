export type nature = 'good' | 'bad';
export interface ILifeEvent {
  name: string;
  description?: string;
  date: number;
  nature?: nature;
  intensity: number; 
}