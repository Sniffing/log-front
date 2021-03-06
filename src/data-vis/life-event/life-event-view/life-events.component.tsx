import React from 'react';
import { Card, Timeline, Spin } from 'antd';
import { computed } from 'mobx';
import { LifeEventStore } from '../../../stores/lifeEventStore';
import { ILifeEvent } from '../../../entry-modal/event-entry';
import { Utils } from '../../../App.utils';

import styles from './life-event-view.module.less';
import { observer } from 'mobx-react';

interface IProps {
  lifeEventStore?: LifeEventStore;
}

@observer
export class LifeEventView extends React.Component<IProps> {
  @computed
  public get data(): ILifeEvent[] {
    return (this.props.lifeEventStore?.lifeEvents || [])
      .slice().sort((a: ILifeEvent, b: ILifeEvent) => {
        return a.date - b.date;
      });
  }

  public render(): React.ReactNode {
    const { lifeEventStore } = this.props;

    if (lifeEventStore?.fetchingLifeEvents?.state === 'pending') {
      return <Spin></Spin>;
    }

    return (
      <Card>
        <Timeline mode="left" reverse className={styles.timeline}>
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
                label={Utils.unixTimeToDateString({time:event.date * 1000})}
                className={styles.timeline_item}>
                <p>{event.name}</p>
                <p className={styles.timeline_item_desc}>{event.description}</p>
              </Timeline.Item>
            );}
          )}
        </Timeline>
      </Card>
    );
  }
}