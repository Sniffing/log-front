import { EChartOption } from 'echarts';
import { IWeightDTO } from '../../App.interfaces';
import { Utils } from '../../App.utils';
import { ILifeEvent } from '../../entry-modal/event-entry';
import { ICalorieEntry } from '../../entry-modal/calorie-entry';

function createCalorieData(entries: ICalorieEntry[]): EChartOption.Series {
  const data = entries
    .map((entry: ICalorieEntry) => {
      const date = new Date(entry.date * 1000);
      const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');

      return {
        name: date.toString(),
        value: [dateVal, entry.calories - 2000],
        itemStyle: {
          color: entry.calories >=2000 ?  '#00356E' : '#002752'
        },
      };
    });

  return {
    name: 'Calories above 2000',
    type: 'bar',
    step: 'middle',
    yAxisIndex: 1,
    symbol: 'none',
    data: data,
  };
}

function createWeightData(weight: IWeightDTO[]) {//}: EChartOption.Series {
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
    itemStyle: {
      color: '#006573'
    },
  };
}

function createEventData(eventData: ILifeEvent[]) {
  return {
    name: 'Events',
    type: 'bar',
    markArea: {
      clip: true,
      data: eventData.map((event: ILifeEvent) => {
        const date = new Date(event.date*1000);
        const nextDate = new Date((event.date + 86400 * event.intensity) * 1000);
        const dateStart = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
        const dateEnd = [nextDate.getFullYear(), nextDate.getMonth()+1, nextDate.getDate()].join('/');
        return [{
          xAxis: dateStart,
          rotate: 90,
          name: event.name,
          label: {
            position: 'insideLeft',
            rotate: 90,
            color: 'black',
            fontSize: 8,
          },
          itemStyle : {
            color: {
              colorStops: [{
                offset: 0,
                color: event.nature === 'good' ? 'green' : 'red' ,
              },{
                offset: 1,
                color: 'transparent',
              }]
            },
            opacity: 0.6,
          },
        }, {
          xAxis: dateEnd,
        }];
      }),
    },
  };
}

interface ICombinedDataSources {
  weightData?: IWeightDTO[];
  calorieData?: ICalorieEntry[];
  eventData?: ILifeEvent[];
}

export function generateCombinedDataOption({
  weightData, calorieData, eventData,
}: ICombinedDataSources): EChartOption {
  return {
    title: {
      text: 'Title'
    },
    legend: {
      data: ['Weight', 'Calories above 2000']
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      containLabel: true
    },
    dataZoom: [{
      type: 'inside',
      start: 50,
      end: 100
    }, {
      start: 0,
      end: 10,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '120%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
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
      createCalorieData(calorieData || []),
      createEventData(eventData || []),
    ]
  };
}