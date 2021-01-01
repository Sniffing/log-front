import { inject, observer } from 'mobx-react';
import React from 'react';
import { CalendarPage } from '..';
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
          <CalendarPage logEntryStore={this.props.logEntryStore}/>
        }>
        <div>Feelings</div>
      </ExpandingContainer>
    );
  }
}