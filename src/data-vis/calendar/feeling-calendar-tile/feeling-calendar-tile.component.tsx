import { Empty } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FeelingCalendar, FeelingCalendarView } from '..';
import { Utils } from '../../../App.utils';
import { ExpandingContainer } from '../../../custom-components/expanding-container/expanding-container.component';
import { KeywordEntry, LogEntryStore } from '../../../stores/logEntryStore';
import { dateFromCalendarRange } from '../feeling-calendar/feeling-calendar-helper';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
@observer
export class FeelingCalendarTile extends React.Component<IProps> {

  @observable
  private index = 0;

  @observable
  private key = '';

  @observable
  private pastDataMap = {};

  @observable
  private pastData: KeywordEntry[] = [];

  public async componentDidMount(): Promise<void> {
    this.props.logEntryStore.fetchLastDates();
    await this.props.logEntryStore.fetchKeywords();
    this.generatePastData();
    this.generatePastDataMap();

    setInterval(this.updateIndex, 5000);
  }

  @action.bound
  private updateIndex() {
    const keys = Object.keys(this.pastDataMap);
    this.index = (this.index + 1) % (keys.length ?? 1);
    this.key = keys[this.index];
    console.log('updated index', this.index, this.key);
  }

  @action.bound
  private generatePastData() {
    const {logEntryStore} = this.props;
    const now = new Date();
    const { to, from } = dateFromCalendarRange({
      from: {
        year: now.getFullYear(),
        month: now.getMonth(),
      }
    });

    this.pastData = logEntryStore.keywords
      .filter((k: KeywordEntry) => {
        console.log(k, k.date);
        const date = Utils.dateFromReversedDateString(k.date);
        if (from > date) {
          return false;
        }
        if (to) {
          return date <= to;
        }
        return true;
      });
  }

  @action.bound
  private generatePastDataMap() {
    const dataMap = {};

    this.pastData.forEach(({date, keywords}) => {
      const d = Utils.dateFromReversedDateString(date);
      const dateVal = [d.getFullYear(), d.getMonth()+1, d.getDate()].join('/');
      keywords.forEach(kw => {
        if (dataMap[kw]) {
          dataMap[kw].push([dateVal, 1]);
        } else {
          dataMap[kw] = [[dateVal, 1]];
        }
      });
    });

    this.pastDataMap = dataMap;
    console.log(this.pastDataMap);
  }

  @computed
  private get tileView(): React.ReactNode {
    const {logEntryStore: store} = this.props;
    const from = moment().subtract(1,'months').toDate();
    const to = new Date();
    const loadFail = !store.keywords.length || !store.lastDates.first || !store.lastDates.last;

    if (loadFail) {
      return <Empty description=""/>;
    }

    return (
      <FeelingCalendar
        logEntryStore={this.props.logEntryStore}
        data={this.pastDataMap[this.key] ?? []}
        title={this.key}
        range={{
          from: {
            year: from.getFullYear(),
            month: from.getMonth(),
          },
          to: {
            year: to.getFullYear(),
            month: to.getMonth()+1,
          }
        }}/>
    );
  }

  public render(): React.ReactNode {
    return (
      <ExpandingContainer
        title="Feelings Calendar"
        expandedComponent={
          <FeelingCalendarView logEntryStore={this.props.logEntryStore}/>
        }>
        {this.tileView}
      </ExpandingContainer>
    );
  }
}