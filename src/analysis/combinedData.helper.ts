import { ICalorieEntry } from '../calories';
import { EChartOption } from 'echarts';
import { IWeightDTO } from '../App.interfaces';
import { Utils } from '../App.utils';

function createCalorieData(entries: ICalorieEntry[]): EChartOption.Series {
  const data = entries
    .map((entry: ICalorieEntry) => {
      const date = new Date(entry.date * 1000);
      const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');

      return {
        name: date.toString(),
        value: [dateVal, entry.calories],
      };
    });

  return {
    name: 'Calories',
    type: 'line',
    step: 'middle',
    yAxisIndex: 1,
    symbol: 'none',
    data: data,
  };
}

function createWeightData(weight: IWeightDTO[]): EChartOption.Series {
  const sortedData = weight?.sort((a: IWeightDTO, b: IWeightDTO) => {
    const dateA = Utils.dateFromString(a.date);
    const dateB = Utils.dateFromString(b.date);
    return dateA > dateB ? 1 : -1;
  });

  const data = sortedData?.map((weight: IWeightDTO) => {
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
  };
}

interface ICombinedDataSources {
  weightData?: IWeightDTO[];
  calorieData?: ICalorieEntry[];
}

export function generateCombinedDataOption({
  weightData, calorieData
}: ICombinedDataSources): EChartOption {
  return {
    title: {
      text: 'Title'
    },
    legend: {
      data: ['Weight']
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: 52,
        max: 72,
        splitLine: {
          show: false
        },
      },
      {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 3500,
        splitLine: {
          show: false
        },
      }
    ],
    series: [
      createWeightData(weightData || []),
      createCalorieData(calorieData || [])
    ]
  };
}