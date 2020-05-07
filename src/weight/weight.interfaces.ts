
export interface IEntryDTO {
  date: string;
}
export interface IWeightDTO extends IEntryDTO {
  weight: string;
}
export interface FormattedWeight {
  date: number;
  weight: number;
}
export interface WeightDates {
  start: number;
  earliest: number;
  end: number;
}