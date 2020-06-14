import React from 'react';
import { observer, inject } from 'mobx-react';
import ReactEcharts from 'echarts-for-react';
import { EChartOption } from 'echarts';

import { computed, observable } from 'mobx';
import { Utils } from '../App.utils';
import { Spin } from 'antd';
import { LogEntryStore } from '../stores/logEntryStore';
import { IWeightDTO } from '../App.interfaces';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
@observer
export class Analysis extends React.Component<IProps> {

  public componentDidMount() {
    this.props.logEntryStore?.fetchWeightData();
  }

  private get weightData(): EChartOption.Series {
    const series = this.props.logEntryStore?.weights;
    const sortedData = series?.sort((a: IWeightDTO, b: IWeightDTO) => {
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
      data: data,
    };
  }

  @observable
  private data: any[] = [];

  @computed
  private get option(): EChartOption {
    return {
      title: {
        text: 'Title'
      },
      tooltip: {
        trigger: 'axis'
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
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        },
        min: 63,
        max: 73,
      },
      series: [
        this.weightData,
      ]
    };
  }

  public render() {
    return (
      <>
        <div>Analysis page</div>
        {this.props.logEntryStore?.fetchingWeight?.case({
          fulfilled: () => <ReactEcharts option={this.option}/>,
          pending: () => <Spin/>,
          rejected: () => <div>fuck</div>,
        })}
      </>
    );
  }
}