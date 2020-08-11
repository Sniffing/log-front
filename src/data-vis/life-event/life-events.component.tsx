import React from 'react';
import { List, Card } from 'antd';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { LifeEventStore } from '../../stores/lifeEventStore';
import { ILifeEvent } from '../../entry-modal/event-entry';

interface IProps {
  lifeEventStore?: LifeEventStore;
}

@inject('lifeEventStore')
@observer
export class LifeEventsPage extends React.Component<IProps> {

  public componentDidMount() {
    this.props.lifeEventStore?.fetchLifeEvents();
  }

  @computed
  public get data() {
    return (this.props.lifeEventStore?.lifeEvents || [])
      .sort((a: ILifeEvent, b: ILifeEvent) => {
        return a.date - b.date;
      });
  }

  public render() {
    const { lifeEventStore } = this.props;

    return (
      <Card>
        <List
          loading={lifeEventStore?.fetchingLifeEvents?.state === 'pending'}
          dataSource={this.data}
          renderItem={(event: ILifeEvent) => (
            <List.Item key={event.date}>
              <List.Item.Meta
                title={event.name}
                description={event.description}
              />
              <div style={{backgroundColor: `${event.nature ? event.nature === 'good' ? 'green' : 'red' : 'grey'}`}}>{event.intensity} ({event.nature || '-'})</div>
            </List.Item>
          )}
        />
      </Card>
    );
  }
}