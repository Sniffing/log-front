import React, { Component } from 'react';
import { Slider, Spin } from 'antd';
import { observer, inject } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Rejected } from '../../custom-components';
import { LogEntryStore } from '../../stores/logEntryStore';
import ReactEcharts from 'echarts-for-react';
import { EChartOption } from 'echarts';
import { Utils } from '../../App.utils';
import { createWeightData, createLineOfBestFitData } from './weight.helper';
import { IWeightDTO } from '../analysis';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
@observer
export class WeightLineGraph extends Component<IProps> {

@observable
private fitCloseness = 4;

public componentDidMount(): void {
  this.props.logEntryStore?.fetchLastDates();
  this.props.logEntryStore?.fetchWeightData();
}

@action
private handlePrecisionChange = (value: number): void => {
  this.fitCloseness = value;
};

@computed
private get option(): EChartOption {
  const sortedData = this.props.logEntryStore?.weights?.sort((a: IWeightDTO, b: IWeightDTO) => {
    const dateA = Utils.dateFromReversedDateString(a.date);
    const dateB = Utils.dateFromReversedDateString(b.date);
    return dateA > dateB ? 1 : -1;
  }) || [];

  const allData = createWeightData(sortedData);
  const lineOfBestFit = createLineOfBestFitData(sortedData, this.fitCloseness);

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
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      min: 62,
      max: 72,
      splitLine: {
        show: false
      },
    },
    series: [
      allData,
      lineOfBestFit,
    ]
  };
}

public render(): React.ReactNode {

  const graph = this.props.logEntryStore?.fetchingWeight?.case({
    fulfilled: () => <ReactEcharts option={this.option} />,
    pending: () => <Spin/>,
    rejected: () =>  <Rejected message={'Error fetching Weights'}/>,
  });

  return <>
    <Slider
      min={2}
      max={7}
      range={false}
      onChange={this.handlePrecisionChange}
      value={this.fitCloseness}
    />
    {graph}
  </>;
}
}
