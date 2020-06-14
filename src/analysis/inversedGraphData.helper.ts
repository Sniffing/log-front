import { IWeightDTO } from '../App.interfaces';
import { ICalorieEntry } from '../calories';
import { Utils } from '../App.utils';
import { EChartOption } from 'echarts';
import { ICombinedDataSources } from '.';

const BASE_CALORIE_AMOUNT = 2000;

function normalise(calorie: number) {
  return calorie - BASE_CALORIE_AMOUNT;
}

function createNormalisedWeightData(weightData: IWeightDTO[]) {
  const sortedData = weightData?.sort((a: IWeightDTO, b: IWeightDTO) => {
    const dateA = Utils.dateFromString(a.date);
    const dateB = Utils.dateFromString(b.date);
    return dateA > dateB ? 1 : -1;
  });

  return sortedData.map((w: IWeightDTO) => {
    const date = Utils.dateFromString(w.date);
    const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
    return [dateVal, parseFloat(w.weight)];
  });
}

function createNormalisedCalorieData(calorieData: ICalorieEntry[]) {
  return calorieData.map((c: ICalorieEntry) => {
    const date = new Date(c.date * 1000);
    const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
    return [dateVal, c.calories];
  });
}

export function generateInversedGraphOption({
  weightData, calorieData
}: ICombinedDataSources): EChartOption<EChartOption.Series> {
  return {
    title: {
      text: 'main text',
      subtext: 'subtext',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false
      }
    },
    legend: {
      data: ['Weight', 'Calorie intake over maintenance (2000)'],
      left: 10
    },
    // axisPointer: {
    //   link: {xAxisIndex: 'all'}
    // },
    dataZoom: [
      {
        show: true,
        xAxisIndex: [0, 1]
      },
      {
        type: 'inside',
        xAxisIndex: [0, 1]
      }
    ],
    grid: [{
      left: 50,
      right: 50,
      height: '35%'
    }, {
      left: 50,
      right: 50,
      top: '55%',
      height: '35%'
    }],
    xAxis: [
      {
        type: 'time',
      },
      {
        gridIndex: 1,
        type: 'time',
        position: 'top'
      }
    ],
    yAxis: [
      {
        name: 'Weight',
        type: 'value',
        min: 60,
        max: 72,
      },
      {
        gridIndex: 1,
        name: 'Calorie intake over maintenance (2000)',
        type: 'value',
        inverse: true
      }
    ],
    series: [
      {
        name: 'Weight',
        type: 'line',
        symbol: 'none',
        hoverAnimation: false,
        data: createNormalisedWeightData(weightData || [])
      },
      {
        name: 'Calorie intake over maintenance (2000)',
        type: 'line',
        symbol: 'none',
        xAxisIndex: 1,
        yAxisIndex: 1,
        hoverAnimation: false,
        data: createNormalisedCalorieData(calorieData || [])
      }
    ]
  };
}