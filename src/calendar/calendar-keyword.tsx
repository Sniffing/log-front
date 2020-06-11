import React, { Component } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import {  Spin, Card, Row } from 'antd';
import { observer, inject } from 'mobx-react';
import { observable, computed } from 'mobx';
import { Rejected } from '../custom-components';
import ReactTooltip from 'react-tooltip';

import './calendar.scss';
import { Utils } from '../App.utils';
import { LogEntryStore, KeywordEntry } from '../stores/logEntryStore';
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

  @computed
  private get heatMapValues() {
    if (!this.props.logEntryStore) {
      return [];
    }

    return this.props.data
      .map((k: KeywordEntry) => {
        return {
          date: k.date,
        };
      });
  }

  @computed
  private get startDate() {
    return new Date(this.props.year, 0,1);
  }

  private get midStartDate() {
    return new Date(this.props.year, 5, 30);
  }

  private get midEndDate() {
    return new Date(this.props.year, 6, 1);
  }

  @computed
  private get endDate() {
    return new Date(this.props.year, 11, 31);
  }

  private get intervals(): IInterval[] {
    return [
      {
        start: this.startDate,
        end: this.midStartDate,
      },
      {
        start: this.midEndDate,
        end: this.endDate,
      },
    ];
  }

  private tooltip = (value: {date: string} | undefined) => {
    const tip = (value?.date) ? Utils.fromReversedDate(value.date) : 'missing entry';
    return {
      'data-tip': tip
    };
  }

  @computed
  private get calendarMap() {
    return (
      <>
        <h3>{this.props.year}</h3>
        {this.intervals.map((interval: IInterval, index: number) => {
          return  (
            <Row key={index}>
              <CalendarHeatmap
                startDate={interval.start}
                endDate={interval.end}
                values={this.heatMapValues}
                showWeekdayLabels
                gutterSize={2}
                weekdayLabels={['M','T','W','T','F','S','S']}
                tooltipDataAttrs={(this.tooltip)}
                classForValue={(value) => {
                  if (!value) {
                    return 'color-empty';
                  }

                  return 'color-filled';
                }}
              />
            </Row>
          );
        }) }
      </>
    );
  }

  public render() {
    return(
      <Card>
        {this.props.logEntryStore?.fetchingKeywords?.case({
          fulfilled: () => this.calendarMap,
          pending: () => <Spin/>,
          rejected: () =>  <Rejected message="Unable to get keywords"/>,
        })}
        <ReactTooltip/>
      </Card>
    );
  }
}

export default CalendarKeyword;
