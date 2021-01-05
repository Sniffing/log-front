import React from 'react';
import { Spin, Select } from 'antd';
import { Rejected } from '../../custom-components';
import { computed, action, observable } from 'mobx';
import { Utils } from '../../App.utils';
import { KeywordEntry, LogEntryStore } from '../../stores/logEntryStore';
import { observer } from 'mobx-react';
import { FeelingCalendar } from './feeling-calendar/feeling-calendar-keyword';
import { PENDING } from 'mobx-utils';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@observer
export class FeelingCalendarView extends React.Component<IProps> {

  @observable
  private filterTerms: string[] = [];

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
        {years.map(year => <FeelingCalendar key={year} data={this.getData(year)} range={{from: {year}}}/>)}
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
    if (this.props.logEntryStore?.fetchingDates?.state === PENDING) {
      return <Spin/>;
    }

    return (
      <div className="calendar-page">
        <Select mode="multiple" style={{width: '40%'}} allowClear onChange={this.handleFilterChange}>
          {this.keywords.slice().sort((a,b) => a.localeCompare(b)).map(w => (
            <Select.Option key={w} value={w}>
              {w}
            </Select.Option>
          ))}
        </Select>
        {this.calendars}
      </div>
    );
  }
}
