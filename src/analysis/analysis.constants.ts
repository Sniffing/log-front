import { IWeightDTO } from '../App.interfaces';
import { ICalorieEntry } from '../calories';

export interface ICombinedDataSources {
  weightData?: IWeightDTO[];
  calorieData?: ICalorieEntry[];
}

export enum AnalysisGraph {
  INVERSE_COMPARE,
  COMBINED_LINES,
}

export const AnalysisGraphs = [
  AnalysisGraph.INVERSE_COMPARE,
  AnalysisGraph.COMBINED_LINES,
];

export const graphLabels = {
  [AnalysisGraph.INVERSE_COMPARE]: 'Inversed line',
  [AnalysisGraph.COMBINED_LINES]: 'Combined line',
};