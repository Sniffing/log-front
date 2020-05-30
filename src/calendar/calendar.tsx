import React from 'react';
import CalendarKeyword from './calendar-keyword';
import { RootStore, KeywordEntry } from '../stores/rootStore';
import { inject, observer } from 'mobx-react';
import { Spin, Select } from 'antd';
import { Rejected } from '../custom-components';
import { computed, action, observable } from 'mobx';
import { Utils } from '../App.utils';

interface IProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
export class CalendarPage extends React.Component<IProps> {

  @observable
  private filterTerms: string[] = [];

  public async componentDidMount() {
    this.props.rootStore?.fetchLastDates();
    this.props.rootStore?.fetchKeywords();
  }

  @computed
  private get calendars() {
    const years: number[] = [];

    if (this.props.rootStore && this.props.rootStore.fetchingDates?.state === 'fulfilled') {
      const {first, last} = this.props.rootStore?.lastDates;

      const firstYear = Utils.dateFromString(first).getFullYear();
      const lastYear = Utils.dateFromString(last).getFullYear();

      Array((lastYear - firstYear) + 1).fill(0).forEach((_,i) => years.push(i + firstYear));
    }

    return (
      <div>
        {years.map(year => <CalendarKeyword key={year} data={this.getData(year)} year={year}/>)}
      </div>
    );
  }

  private getData(year: number): KeywordEntry[] {
    if (!this.props.rootStore) return [];

    return this.props.rootStore?.keywords
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
    this.props.rootStore?.keywords.forEach((k: KeywordEntry) => {
      k.keywords.forEach(w => set.add(w));
    });

    return Array.from(set);
  }

  @action.bound
  private handleFilterChange(value: string[]) {
    this.filterTerms = value;
  }

  public render() {
    return (
      <div className="calendar-page">
        <Select mode="multiple" style={{width: '40%'}} onChange={this.handleFilterChange}>
          {this.keywords.map(w => (
            <Select.Option key={w} value={w}>
              {w}
            </Select.Option>
          ))}
        </Select>
        {this.props.rootStore?.fetchingDates?.case({
          fulfilled: () => this.calendars,
          pending: () => <Spin/>,
          rejected: () => <Rejected message="Unable to fetch entries"/>,
        })}
      </div>
    );
  }
}
