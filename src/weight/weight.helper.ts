import { FormattedWeight, IWeightDTO } from '.';
import { LineSeriesPoint } from 'react-vis';
import regression, { Result } from 'regression';
import { Utils } from '../App.utils';

const formatWeightDTO = (dto: IWeightDTO) => {
  const entry: FormattedWeight = {
    date: Date.parse(dto.date),
    weight: parseFloat(dto.weight)
  };
  return entry;
};

export const formatResults = (data: IWeightDTO[]): FormattedWeight[] => {
  return data.map(formatWeightDTO);
}; 

export const sortByDate = (collection: FormattedWeight[]) => {
  return collection.slice().sort(
    (a: FormattedWeight, b: FormattedWeight) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate > bDate ? 1 : -1;
    }
  );
};

export const convertToGraphData = (data: FormattedWeight[]) => {
  return data.map(d => {
    const entry: LineSeriesPoint = {
      x: d.date,
      y: d.weight
    };
    return entry;
  });
};

export const computeLineOfBestFit = (data: FormattedWeight[], fitCloseness: number) => {
  const base = data[0];
  const line: Result = regression.polynomial(
    data.map(d => {
      return [d.date - base.date, d.weight];
    }),
    {
      order: fitCloseness,
      precision: 75
    }
  );

  const answer = line.points.map(point => {
    return {
      x: point[0] + base.date,
      y: point[1]
    };
  });
  return answer;
};

export const computeLineOfAverage = (data: FormattedWeight[], averageWeight: number) => {
  return data.length > 0
    ? [
      {
        x: data[0].date,
        y: averageWeight
      },
      {
        x: data[data.length - 1].date,
        y: averageWeight
      }
    ]
    : [];
};

export const getTitleLinePoint = (point: LineSeriesPoint) => ({
  title: 'Date',
  value: Utils.unixTimeToDate(point[0].x)
});