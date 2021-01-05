import { Empty } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { FeelingCalendarView } from '..';
import { ExpandingContainer } from '../../../custom-components/expanding-container/expanding-container.component';
import { LogEntryStore } from '../../../stores/logEntryStore';

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

  private get tileView(): React.ReactNode {
    const {logEntryStore: store} = this.props;
    const loadFail = !store.keywords.length || !store.lastDates.first || !store.lastDates.last;

    if (loadFail) {
      return <Empty description=""/>;
    }

    return (
      <div>component</div>
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