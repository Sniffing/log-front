import React from 'react';
import CalendarKeyword from './calendar-keyword';
import { inject, observer } from 'mobx-react';
import { Spin, Select } from 'antd';
import { Rejected } from '../../custom-components';
import { computed, action, observable } from 'mobx';
import { Utils } from '../../App.utils';
import { KeywordEntry, LogEntryStore } from '../../stores/logEntryStore';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
@observer
export class CalendarPage extends React.Component<IProps> {

  @observable
  private filterTerms: string[] = [];

  public async componentDidMount(): Promise<void> {
    this.props.logEntryStore?.fetchLastDates();
    this.props.logEntryStore?.fetchKeywords();
  }

  @computed
  private get calendars() {
    const years: number[] = [];

    if (this.props.logEntryStore.fetchingDates?.state === 'fulfilled') {
      const {first, last} = this.props.logEntryStore?.lastDates;

      const firstYear = Utils.dateFromReversedDateString(first).getFullYear();
      const lastYear = Utils.dateFromReversedDateString(last).getFullYear();

      Array((lastYear - firstYear) + 1)
        .fill(0)
        .forEach((_,i) => years.push(i + firstYear));
    }

    return (
      <div>
        {years.map(year => <CalendarKeyword key={year} data={this.getData(year)} year={year}/>)}
      </div>
    );
  }

  private getData(year: number): KeywordEntry[] {

    return this.props.logEntryStore?.keywords
      .filter((entry: KeywordEntry) =>  Number(entry.date.split('-')[0]) === year)
      .filter((entry: KeywordEntry) => {
        for(let i=0; i<this.filterTerms.length; i++) {
          if (entry.keywords.includes(this.filterTerms[i])) return true;
        }

        return false;
      });
  }

  @computed
  private get keywords() {
    const set = new Set<string>();
    this.props.logEntryStore?.keywords.forEach((k: KeywordEntry) => {
      k.keywords.forEach(w => set.add(w));
    });

    return Array.from(set);
  }

  @action.bound
  private handleFilterChange(value: string[]): void {
    this.filterTerms = value;
  }

  public render(): React.ReactNode {
    return (
      <div className="calendar-page">
        <Select mode="multiple" style={{width: '40%'}} allowClear onChange={this.handleFilterChange}>
          {this.keywords.sort((a,b) => a.localeCompare(b)).map(w => (
            <Select.Option key={w} value={w}>
              {w}
            </Select.Option>
          ))}
        </Select>
        {this.props.logEntryStore?.fetchingDates?.case({
          fulfilled: () => this.calendars,
          pending: () => <Spin/>,
          rejected: () => <Rejected message="Unable to fetch entries"/>,
        })}
      </div>
    );
  }
}
