import { inject, observer } from 'mobx-react';
import React from 'react';
import { MemoryPage } from '../memory-page/memory-page';
import { ExpandingContainer } from '../../../custom-components/expanding-container/expanding-container.component';
import { LogEntryStore } from '../../../stores/logEntryStore';
import { computed } from 'mobx';
import { Utils } from '../../../App.utils';
import { Spin } from 'antd';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
@observer
export class MemoryTile extends React.Component<IProps> {

  public componentDidMount(): void {
    this.props.logEntryStore?.fetchMemory();
  }

  @computed
  private get lastYearMemory() {
    const {memories} = this.props.logEntryStore;
    const todayString = Utils.unixTimeToDateString({ time: Date.now() });
    const lastYear = Utils.addYearToDateString(todayString, -1);

    const reversedLastYear = Utils.unreverseDateFromServer(lastYear);
    const lastYearMemory = memories.find(x => x.date === reversedLastYear);
    return lastYearMemory?.text ?? 'No memory on this day...';
  }

  @computed
  private get tileView(): React.ReactNode {
    return (
      <div>
        <p>There are <strong>{this.props.logEntryStore.memories?.length}</strong> records</p>
        <p>On this day last year:</p>

        {this.lastYearMemory}
      </div>
    );
  }

  public render(): React.ReactNode {
    if (!this.props.logEntryStore.memories?.length) {
      return <Spin/>;
    }

    return (
      <ExpandingContainer
        title="Memories"
        expandedComponent={
          <MemoryPage logEntryStore={this.props.logEntryStore}/>
        }>
        {this.tileView}
      </ExpandingContainer>
    );
  }
}