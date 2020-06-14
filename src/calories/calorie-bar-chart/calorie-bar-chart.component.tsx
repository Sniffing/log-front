import React from 'react';
import { CalorieStore } from '../../stores/calorieStore';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import ReactEcharts from 'echarts-for-react';
import { Card, Spin, Alert } from 'antd';
import { ICalorieEntry } from '../calorie.interfaces';
import { EChartOption } from 'echarts';
import { Utils } from '../../App.utils';

interface IProps {
  calorieStore?: CalorieStore;
}

@inject('calorieStore')
@observer
export class CalorieBarChart extends React.Component<IProps> {

  public componentDidMount() {
    this.props.calorieStore?.fetchCalorieEntries();
  }

  @computed
  private get option(): EChartOption {
    const data = this.props.calorieStore?.calorieEntries || [];

    return {
      title : {
        text: 'Calories per day'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((entry: ICalorieEntry) => Utils.unixTimeToDate(entry.date * 1000)),
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 5500,
      },
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 50
      }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [{
        data: data.map((entry: ICalorieEntry) => entry.calories),
        type: 'line',
        // smooth: true,
        itemStyle: {
          color: 'rgb(255, 158, 131)'
        },
        areaStyle: {
          color: 'rgb(255, 158, 68)'
        },
      }]
    };
  }

  public render() {
    if (!this.props.calorieStore || !this.props.calorieStore.fetchingCalories) {
      return 'Error';
    }

    return (
      <Card>
        {
          this.props.calorieStore.fetchingCalories.case({
            fulfilled: () => <ReactEcharts option={this.option}/>,
            pending: () => <Spin/>,
            rejected: () => <Alert
              message="Could not load calorie data"
              type="error"
            />,
          })
        }
      </Card>
    );
  }
}