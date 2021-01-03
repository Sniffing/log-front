import { Empty, Badge } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { LifeEventView } from '..';
import { Utils } from '../../../App.utils';
import { ExpandingContainer } from '../../../custom-components/expanding-container/expanding-container.component';
import { ILifeEvent } from '../../../entry-modal/event-entry';
import { LifeEventStore } from '../../../stores/lifeEventStore';

interface IProps {
  lifeEventStore?: LifeEventStore;
}

@inject('lifeEventStore')
@observer
export class LifeEventTile extends React.Component<IProps> {

  public componentDidMount(): void {
    this.props.lifeEventStore?.fetch();
  }

  @computed
  private get mostRecentEvent(): ILifeEvent {
    const {lifeEvents} = this.props.lifeEventStore;
    return lifeEvents?.length ? lifeEvents[lifeEvents.length - 1] : undefined;
  }

  @computed
  private get recentEventView(): React.ReactNode {
    if (!this.mostRecentEvent) {
      return <Empty description="No events saved"/>;
    }

    const { date, intensity, name, description, nature } = this.mostRecentEvent;

    return (
      <Badge
        count={intensity}
        style={{backgroundColor: nature === 'good' ? 'greem' : 'red'}}
        offset={[5,5]}
      >
        <div>
          <span>{name}</span>
          <span>{Utils.unixTimeToDateString({time:date * 1000})}</span>
          <p>{description}</p>
        </div>
      </Badge>
    );
  }

  public render(): React.ReactNode {
    return (
      <ExpandingContainer
        title="Events"
        expandedComponent={
          <LifeEventView lifeEventStore={this.props.lifeEventStore}/>
        }>
        <div>
          <p>Most recent event</p>
          {this.recentEventView}
        </div>
      </ExpandingContainer>
    );
  }
}