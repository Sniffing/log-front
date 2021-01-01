import { inject, observer } from 'mobx-react';
import React from 'react';
import { WeightLineGraph } from '..';
import { ExpandingContainer } from '../../../custom-components/expanding-container/expanding-container.component';
import { LogEntryStore } from '../../../stores/logEntryStore';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
@observer
export class WeightTile extends React.Component<IProps> {

  public render(): React.ReactNode {
    return (
      <ExpandingContainer title="Weight">
        <WeightLineGraph logEntryStore={this.props.logEntryStore}/>
      </ExpandingContainer>
    );
  }
}