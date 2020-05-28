import React, { Component } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import {  Spin } from 'antd';
import { observer, inject } from 'mobx-react';
import { observable, computed } from 'mobx';
import { RootStore, KeywordEntry } from '../stores/rootStore';
import { Rejected } from '../custom-components';

import './calendar.scss';
interface IProps {
  rootStore?: RootStore;
  data: KeywordEntry[];
  year: number;
}

@inject('rootStore')
@observer
class CalendarKeyword extends Component<IProps> {

  @observable
  private searchTerm = '';

  @computed
  private get heatMapValues() {
    if (!this.props.rootStore) {
      return [];
    }

    return this.props.data
      // .filter((k: KeywordEntry) => this.searchTerm.length > 0 ? true : k.keywords.includes(this.searchTerm))
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

  @computed
  private get endDate() {
    return new Date(this.props.year, 11, 31);
  }

  @computed
  private get calendarMap() {
    console.log(this.startDate, this.endDate);
    return (
      <>
        <h3>{this.props.year}</h3>
        <CalendarHeatmap
          startDate={this.startDate}
          endDate={this.endDate}
          values={this.heatMapValues}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }

            return 'color-filled';
          }}
        />
      </>
    );
  }

  public render() {
    return(
      <div>
        {this.props.rootStore?.fetchingKeywords?.case({
          fulfilled: () => this.calendarMap,
          pending: () => <Spin/>,
          rejected: () =>  <Rejected message="Unable to get keywords"/>,
        })}
        <p> Days of {this.searchTerm}: </p>
      </div>
    );
  }
}

export default CalendarKeyword;
