import React from 'react';
import { Card, Timeline, Spin, Affix, PageHeader, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import { LifeEventStore } from '../../stores/lifeEventStore';
import { ILifeEvent } from '../../entry-modal/event-entry';
import { Utils } from '../../App.utils';

import styles from './life-events.module.less';

interface IProps {
  lifeEventStore?: LifeEventStore;
}

@inject('lifeEventStore')
@observer
export class LifeEventsPage extends React.Component<IProps> {

  @observable
  private container: Window | HTMLElement | null = null;

  public componentDidMount(): void {
    this.props.lifeEventStore?.fetch();
  }

  @action.bound
  private setContainer(ref: any): void{
    this.container = ref;
  }

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
        <div ref={this.setContainer}>
          <Affix target={() => this.container}>
            <PageHeader
              ghost={false}
              title={null}
              style={{
                padding: 0
              }}
              extra={[
                <Button key="good">
                Affix top
                </Button>,
              ]}
            />
          </Affix>
        </div>

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