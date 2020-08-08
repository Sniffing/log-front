import React, { Component } from 'react';
import {  Spin, Card } from 'antd';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Rejected } from '../custom-components';

import { Utils } from '../App.utils';
import { LogEntryStore, KeywordEntry } from '../stores/logEntryStore';
import ReactEcharts from 'echarts-for-react';
import { EChartOption } from 'echarts';
interface IProps {
  logEntryStore?: LogEntryStore;
  data: KeywordEntry[];
  year: number;
}

interface IInterval {
  start: Date;
  end: Date;
}

@inject('logEntryStore')
@observer
class CalendarKeyword extends Component<IProps> {

  @observable
  private searchTerm = '';

  private generateHeatMapValues(year: number) {
    return this.props.data
      .filter((k: KeywordEntry) => {
        return year === Utils.dateFromString(k.date).getFullYear();
      })
      .map((k: KeywordEntry) => {
        const date = Utils.dateFromString(k.date);
        const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
        return [dateVal, 1];
      });
  }

  private getOption(year: number): EChartOption<EChartOption.SeriesHeatmap> {
    return {
      title: {
        left: 'center',
        text: `${year}`
      },
      // visualMap: [{
      //   min: 0,
      //   max: 1,
      //   splitNumber: 1,
      //   type: 'piecewise',
      //   orient: 'horizontal',
      //   left: 'center',
      //   top: 65,
      //   textStyle: {
      //     color: '#000'
      //   }
      // }],
      calendar: {
        left: 30,
        right: 30,
        cellSize: ['auto', 14],
        range: year,
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: {show: false}
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: this.generateHeatMapValues(year),
      }]
    };
  }

  public render() {
    return(
      <Card>
        {this.props.logEntryStore?.fetchingKeywords?.case({
          fulfilled: () => <ReactEcharts option={this.getOption(this.props.year)}/>,
          pending: () => <Spin/>,
          rejected: () =>  <Rejected message="Unable to get keywords"/>,
        })}
      </Card>
    );
  }
}

export default CalendarKeyword;
