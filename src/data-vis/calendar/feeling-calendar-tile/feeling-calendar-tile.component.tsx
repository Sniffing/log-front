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
  public render(): React.ReactNode {
    return (
      <ExpandingContainer
        title="Feelings Calendar"
        expandedComponent={
          <FeelingCalendarView logEntryStore={this.props.logEntryStore}/>
        }>
        <div>Feelings</div>
      </ExpandingContainer>
    );
  }
}