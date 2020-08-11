import { IWeightDTO } from '../../App.interfaces';
import { ICalorieEntry } from '../../entry-modal/calorie-entry';

export interface ICombinedDataSources {
  weightData?: IWeightDTO[];
  calorieData?: ICalorieEntry[];
}

export enum AnalysisGraph {
  COMBINED_LINES,
}

export const AnalysisGraphs = [
  AnalysisGraph.COMBINED_LINES,
];

export const graphLabels = {
  [AnalysisGraph.COMBINED_LINES]: 'Combined line',
};