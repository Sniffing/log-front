import { Empty, Spin } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { PENDING } from 'mobx-utils';
import moment from 'moment';
import React from 'react';
import { KeywordView, WordCount } from '..';
import { Utils } from '../../../App.utils';
import { ExpandingContainer } from '../../../custom-components/expanding-container/expanding-container.component';
import { KeywordEntry, LogEntryStore } from '../../../stores/logEntryStore';
import { KeywordTreemap } from '../keyword-treemap/keyword-treemap';

interface IProps {
  logEntryStore?: LogEntryStore
}

@inject('logEntryStore')
@observer
export class KeywordTile extends React.Component<IProps> {

  public componentDidMount(): void {
    this.props.logEntryStore.fetchKeywords();
  }

  @computed
  private get data(): WordCount[] {
    const data = this.props.logEntryStore.keywords;
    const monthBoundary = Utils.toReversedDate(moment().subtract(7, 'months').subtract(1, 'years').toDate());

    const lastMonthEntries = data.filter(({date}) => date >= monthBoundary);
    const lastMonthData: Record<string, number> = {};

    lastMonthEntries.forEach(({keywords}) => {
      keywords.forEach(w => {
        lastMonthData[w] = (lastMonthData[w] ?? 0) + 1;
      });
    });

    return Object.entries(lastMonthData).map(([key, value]) => ({ key, value }));
  }

  @computed
  private get tileView() {
    const {logEntryStore} = this.props;

    if (logEntryStore.fetchingKeywords?.state === PENDING) {
      return <Spin/>;
    }

    if (!this.data.length) {
      return <Empty description="No entries over last month"/>;
    }

    return <KeywordTreemap
      data={this.data}
      logEntryStore={logEntryStore}
      minCount={0}
    />;
  }

  public render(): React.ReactNode {
    const { logEntryStore } = this.props;
    return (
      <ExpandingContainer
        title="Keywords"
        expandedComponent={
          <KeywordView logEntryStore={logEntryStore}/>
        }
      >
        {this.tileView}
      </ExpandingContainer>
    );
  }
}