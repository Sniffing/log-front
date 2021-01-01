import { inject, observer } from 'mobx-react';
import React from 'react';
import { LifeEventsPage } from '..';
import { ExpandingContainer } from '../../../custom-components/expanding-container/expanding-container.component';
import { LifeEventStore } from '../../../stores/lifeEventStore';

interface IProps {
  lifeEventStore?: LifeEventStore;
}

@inject('lifeEventStore')
@observer
export class LifeEventTile extends React.Component<IProps> {

  public render(): React.ReactNode {
    return (
      <ExpandingContainer
        title="Events"
        expandedComponent={
          <LifeEventsPage lifeEventStore={this.props.lifeEventStore}/>
        }>
        <div>Events</div>
      </ExpandingContainer>
    );
  }
}