import regression, { Result, DataPoint } from 'regression';
import { Utils } from '../App.utils';
import { IWeightDTO } from '../App.interfaces';


export const createLineOfBestFitData = (weights: IWeightDTO[], fitCloseness: number) => {
  if (!weights.length) {
    return {
      name: 'Line of best fit',
      type: 'line',
      symbol: 'none',
      data: [],
    };
  }

  const base = Utils.dateFromString(weights[0].date).getTime();

  const line: Result = regression.polynomial(
    weights.map(d => {
      const date = new Date(Utils.fromReversedDate(d.date));
      return [date.getTime() - base, parseFloat(d.weight)];
    }),
    {
      order: fitCloseness,
      precision: 75
    }
  );

  const data = line.points.map((point: DataPoint) => {

    const date = new Date(point[0] + base);
    const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');

    return {
      name: date.toString(),
      value: [dateVal, point[1]],
    };
  });

  return {
    name: 'Line of best fit',
    type: 'line',
    symbol: 'none',
    data: data,
  };
};

export const getAverageWeight = (weights: IWeightDTO[]) => {
  const totalWeight = weights
    .map(d => Number(d.weight))
    .reduce((acc, item) => acc + item, 0);

  return  totalWeight / weights.length;
};

export function createWeightData(weights: IWeightDTO[]) {

  const data = weights.map((weight: IWeightDTO) => {
    const date = Utils.dateFromString(weight.date);
    const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
    const num: number = parseFloat(weight.weight);

    return {
      name: date.toString(),
      value: [dateVal, num],
    };
  });

  return {
    name: 'Weight',
    type: 'line',
    symbol: 'none',
    data: data,
    markLine: {
      data: [
        {type: 'average', name: 'Average'}
      ]
    }
  };
}