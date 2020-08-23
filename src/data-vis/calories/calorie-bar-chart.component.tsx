import React from 'react';
import { inject, observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import ReactEcharts from 'echarts-for-react';
import { Card, Spin, Alert, Button, Input } from 'antd';
import { EChartOption } from 'echarts';
import { CalorieStore } from '../../stores/calorieStore';
import { ICalorieEntry } from '../../entry-modal/calorie-entry';

interface IProps {
  calorieStore?: CalorieStore;
}

@inject('calorieStore')
@observer
export class CalorieBarChart extends React.Component<IProps> {

  @observable
  private showDifference = false;

  @observable
  private maintenance = 2000;

  public componentDidMount() {
    this.props.calorieStore?.fetch();
  }

  @computed
  private get graphData(): ICalorieEntry[] {
    if (this.showDifference) {
      return this.props.calorieStore?.calorieEntries.map((entry: ICalorieEntry) => {
        return {
          date: entry.date,
          calories: entry.calories - this.maintenance
        };
      }) || [];
    }

    return this.props.calorieStore?.calorieEntries || [];
  }

  @computed
  private get option(): EChartOption {
    return {
      title : {
        text: 'Calories per day'
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 5000 - (this.showDifference ? this.maintenance : 0),
      },
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      dataZoom: [{
        type: 'inside',
        start: 50,
        end: 100
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
        data: this.graphData
          .filter((entry: ICalorieEntry) => entry.calories >= 0)
          .map(({date : d, calories}: ICalorieEntry) => {
            const date = new Date(d*1000);
            const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
            return {
              name: date.toString(),
              value: [dateVal, calories],
            };
          }),
        type: 'bar',
        itemStyle: {
          color: this.showDifference ? 'rgb(150, 0, 0)' : 'rgb(225, 140, 60)'
        },
        areaStyle: {
          color: this.showDifference ? 'rgb(150, 0, 0)' : 'rgb(22, 140, 60)'
        },
      },
      {
        data: this.graphData
          .filter((entry: ICalorieEntry) => entry.calories < 0)
          .map(({date : d, calories}: ICalorieEntry) => {
            const date = new Date(d*1000);
            const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
            return {
              name: date.toString(),
              value: [dateVal, calories],
            };
          }),
        type: 'bar',
        itemStyle: {
          color: 'rgb(10, 150, 25)'
        },
        areaStyle: {
          color: 'rgb(10, 150, 25)'
        },
      }]
    };
  }

  @action.bound
  private toggleGraphData() {
    this.showDifference = !this.showDifference;
  }

  @action.bound
  private changeMaintenance(event: React.ChangeEvent<HTMLInputElement>) {
    this.maintenance = parseInt(event.target.value) || 0;
  }

  public render() {
    if (!this.props.calorieStore || !this.props.calorieStore.fetchingCalories) {
      return 'Error';
    }

    return (
      <Card>
        <Button onClick={this.toggleGraphData}>
          {`Show ${this.showDifference ? 'normal' : 'difference'}`}
        </Button>
        <Input value={this.maintenance} onChange={this.changeMaintenance}/>
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