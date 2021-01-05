import { Empty } from 'antd';
import { range } from 'lodash';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
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

  public componentDidMount(): void {
    this.props.logEntryStore.fetchLastDates();
    this.props.logEntryStore.fetchKeywords();
  }

  @computed
  private get monthData() {
    const {logEntryStore} = this.props;
    const now = new Date();
    const { to, from } = dateFromCalendarRange({
      from: {
        year: now.getFullYear(),
        month: now.getMonth(),
      }
    });

    return logEntryStore.keywords
      .filter((k: KeywordEntry) => {
        const date = Utils.dateFromReversedDateString(k.date);
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

  private get tileView(): React.ReactNode {
    const {logEntryStore: store} = this.props;
    const now = new Date();
    const loadFail = !store.keywords.length || !store.lastDates.first || !store.lastDates.last;

    if (loadFail) {
      return <Empty description=""/>;
    }

    return (
      <FeelingCalendar logEntryStore={this.props.logEntryStore} data={this.props.logEntryStore.keywords} range={{
        from: {
          year: now.getFullYear(),
          month: now.getMonth(),
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