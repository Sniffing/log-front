import React, { Component } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import './calendar.scss';
import { Select, Spin } from 'antd';
import { observer, inject } from 'mobx-react';
import { observable, computed } from 'mobx';
import { RootStore, KeywordEntry } from '../stores/rootStore';
import { Rejected } from '../custom-components';

const { Option } = Select;

interface IProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
class CalendarKeyword extends Component<IProps> {

  @observable
  private searchTerm = '';

  public async componentDidMount() {
    this.props.rootStore?.fetchKeywords();
    this.props.rootStore?.fetchLastDates();
  }

  @computed
  private get heatMapValues() {
    if (!this.props.rootStore) {
      return [];
    }

    return this.props.rootStore.keywords
      .filter((k: KeywordEntry) => k.keywords.includes(this.searchTerm))
      .map((k: KeywordEntry) => {
        return {
          date: k.date,
        };
      });
  }

  @computed
  private get startDate() {
    if (!this.props.rootStore) return new Date();

    return new Date(this.props.rootStore.lastDates.first);
  }

  @computed
  private get endDate() {
    if (!this.props.rootStore) return new Date();

    return new Date(this.props.rootStore.lastDates.last);
  }

  private get calendarMap() {
    return (
      <>
        <Select>
        </Select>
        <CalendarHeatmap
          startDate={this.startDate}
          endDate={this.endDate}
          values={this.heatMapValues}
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
