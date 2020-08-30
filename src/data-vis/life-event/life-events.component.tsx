import React from 'react';
import { Card, Timeline, Spin, Affix, PageHeader, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { LifeEventStore } from '../../stores/lifeEventStore';
import { ILifeEvent } from '../../entry-modal/event-entry';
import { Utils } from '../../App.utils';

import './life-events.scss';

interface IProps {
  lifeEventStore?: LifeEventStore;
}

@inject('lifeEventStore')
@observer
export class LifeEventsPage extends React.Component<IProps> {

  public componentDidMount() {
    this.props.lifeEventStore?.fetch();
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
    if (lifeEventStore?.fetchingLifeEvents?.state === 'pending') {
      return <Spin></Spin>;
    }

    return (
      <Card>
        <Affix offsetTop={10}>
          <PageHeader
            ghost={false}
            title={null}
            extra={[
              <Button key="good">
                Affix top
              </Button>,
            ]}
          />

        </Affix>
        <Timeline mode="left" reverse className="timeline">
          {this.data.map((event: ILifeEvent) => {
            const good = event.nature === 'good';
            const nature = event.nature;
            const size = event.intensity ? 16 + event.intensity ^ 1.05 : 16;

            const timelineDotConfig = {
              color: nature ? good ? 'green' : 'red' : 'gray',
              dot: nature ?
                (
                  <div style={{
                    fontSize: `${size}px`,
                    border: '1px solid',
                    borderRadius: size,
                    width: size + 6 * (event.intensity/5),
                    height: size + 6 * (event.intensity/5),
                    textAlign: 'center',
                    paddingTop: '1px'
                  }}>
                    {event.intensity}
                  </div>
                )
                : undefined
            };

            return (
              <Timeline.Item key={event.date} {...timelineDotConfig}
                label={Utils.unixTimeToDate({time:event.date * 1000})}
                className="timelineItem">
                <p className="name">{event.name}</p>
                <p className="desc">{event.description}</p>
              </Timeline.Item>
            );}
          )}
        </Timeline>
      </Card>
    );
  }
}