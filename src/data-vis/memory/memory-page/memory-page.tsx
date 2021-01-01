import React, { Component } from 'react';
import { Button, Card, Spin, Row } from 'antd';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';

import * as styles from './memory-page.module.less';
import { Utils } from '../../../App.utils';
import { Rejected } from '../../../custom-components';
import { LogEntryStore, Memory } from '../../../stores/logEntryStore';
import { StepBackwardOutlined, CaretLeftOutlined, CaretRightOutlined, StepForwardOutlined } from '@ant-design/icons/lib/icons';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@observer
export class MemoryPage extends Component<IProps> {
  @observable
  private currentIndex = 0;

  @action
  private rollNewMemory = () => {
    if (!this.props.logEntryStore?.memories) return;

    let random = Math.random();
    random *= this.props.logEntryStore.memories.length - 1;
    this.currentIndex = random;
  };

  @computed
  private get memory(): Memory {
    const memories = this.props.logEntryStore?.memories;
    const memory = memories ? memories[this.currentIndex] : undefined;

    return memory;
  }

  @computed
  private get memoriesLength() {
    return (this.props.logEntryStore?.memories.length  || 1) -1;
  }

  @action.bound
  private goFirst() {
    this.currentIndex = 0;
  }

  @action.bound
  private goLast() {
    this.currentIndex = this.memoriesLength;
  }

  @action.bound
  private goNext() {
    this.currentIndex = Math.min(this.currentIndex + 1, this.memoriesLength);
  }

  @action.bound
  private goPrev() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
  }

  @computed
  private get memoryDisplayComponent() {
    return (
      <Card title={`${Utils.displayStringfromReversedDate(this.memory.date)}`} className={`${styles.memory_card}`}>
        <p>{this.memory.text}</p>
      </Card>
    );
  }

  public render(): React.ReactNode {
    return (
      <div className={styles.memory}>
        {this.props.logEntryStore?.fetchingMemory?.case({
          fulfilled: () => this.memoryDisplayComponent,
          pending: () => <Spin/>,
          rejected: () => <Rejected message="Unable to fetch memories"/>,
        })}

        <Row className={`${styles.memory_buttons} mt-12`}>
          <Button
            className='mr-4'
            icon={<StepBackwardOutlined />}
            onClick={this.goFirst}
            disabled={this.currentIndex === 0}
          />
          <Button className='mr-4'
            icon={<CaretLeftOutlined />}
            onClick={this.goPrev}
            disabled={this.currentIndex === 0}
          />
          <Button className='mr-4' onClick={this.rollNewMemory} disabled={!this.memory}>
          Random Memory
          </Button>
          <Button
            className='mr-4'
            icon={<CaretRightOutlined />}
            onClick={this.goNext}
            disabled={this.currentIndex === this.memoriesLength}
          />
          <Button
            icon={<StepForwardOutlined />}
            onClick={this.goLast}
            disabled={this.currentIndex === this.memoriesLength}
          />
        </Row>

      </div>
    );
  }
}
