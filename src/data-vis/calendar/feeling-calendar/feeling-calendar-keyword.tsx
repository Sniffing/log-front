import React, { Component } from 'react';
import {  Spin } from 'antd';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';

import { Utils } from '../../../App.utils';
import { LogEntryStore, KeywordEntry } from '../../../stores/logEntryStore';
import { EChartOption } from 'echarts';
import { ReactEcharts } from '../../../custom-components/ReactEcharts';
import { FULFILLED } from 'mobx-utils';
import { dateFromCalendarRange, echartRangeFromCalendarRange } from './feeling-calendar-helper';
import { isArray } from 'lodash';


import './feeling-calendar-keyword.less';
export interface ICalendarRange {
  from: {
    year: number,
    month?: number,
    day?: number,
  },
  to?: {
    year: number,
    month?: number,
    day?: number,
  }
}
interface IProps {
  logEntryStore?: LogEntryStore;
  data: KeywordEntry[];
  range: ICalendarRange;
}

@inject('logEntryStore')
@observer
export class FeelingCalendar extends Component<IProps> {

  @observable
  private searchTerm = '';

  private generateHeatMapValues(range: ICalendarRange) {
    const { to, from } = dateFromCalendarRange(range);

    return this.props.data
      .filter((k: KeywordEntry) => {
        const date = Utils.dateFromReversedDateString(k.date);
        console.log('hi', from, to, date);
        if (from > date) {
          return false;
        }
        if (to) {
          return date <= to;
        }
        return true;
      })
      .map((k: KeywordEntry) => {
        const date = Utils.dateFromReversedDateString(k.date);
        const dateVal = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
        return [dateVal, 1];
      });
  }

  private getOption(range: ICalendarRange): EChartOption<EChartOption.SeriesHeatmap> {
    const mapRange = echartRangeFromCalendarRange(range);

    return {
      title: {
        left: 'center',
        text: `${isArray(mapRange) ? mapRange.join(' - ') : mapRange}`,
        textStyle: {
          fontSize: 16
        }
      },
      visualMap: [{
        min: 0,
        max: 1,
        splitNumber: 1,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        show: false,
      }],
      calendar: {
        left: 20,
        right: 20,
        top: 45,
        range: mapRange,
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: {show: false}
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: this.generateHeatMapValues(range),
      }]
    };
  }

  public render(): React.ReactNode {
    if (this.props.logEntryStore?.fetchingKeywords?.state !== FULFILLED) {
      return <Spin/>;
    }
    return(
      <ReactEcharts option={this.getOption(this.props.range)} className="calendar"/>
    );
  }
}