import React, { Component } from 'react';
import { Button, Card, Spin, Row } from 'antd';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';

import './memory.scss';
import { Utils } from '../App.utils';
import { Rejected } from '../custom-components';
import { LogEntryStore } from '../stores/logEntryStore';
import { StepBackwardOutlined, CaretLeftOutlined, CaretRightOutlined, StepForwardOutlined } from '@ant-design/icons/lib/icons';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
@observer
export class MemoryPage extends Component<IProps> {
  @observable
  private currentIndex = 0;

  public componentDidMount() {
    this.props.logEntryStore?.fetchMemory();
  }

  @action
  private rollNewMemory = () => {
    if (!this.props.logEntryStore?.memories) return;

    let random = Math.random();
    random *= this.props.logEntryStore.memories.length - 1;
    this.currentIndex = random;
  };

  @computed
  private get memory() {
    const memories = this.props.logEntryStore?.memories;
    const memory = memories ? memories[this.currentIndex] : undefined;

    return memory ? memory : {date: '', text: ''};
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

  public render() {
    return (
      <div className='memory'>
        <div style={{ minHeight: '500px'}}>
          {this.props.logEntryStore?.fetchingMemory?.case({
            fulfilled: () =>
              <Card title={`${Utils.fromReversedDate(this.memory.date)}`} className='card'>
                <p>{this.memory.text}</p>
              </Card>,
            pending: () => <Spin/>,
            rejected: () => <Rejected message="Unable to fetch memories"/>,
          })}
        </div>

        <Row className='buttons'>
          <Button
            icon={<StepBackwardOutlined />}
            onClick={this.goFirst}
            disabled={this.currentIndex === 0}
          />
          <Button
            icon={<CaretLeftOutlined />}
            onClick={this.goPrev}
            disabled={this.currentIndex === 0}
          />
          <Button className='rollButton' onClick={this.rollNewMemory} disabled={!!this.memory}>
          Random Memory
          </Button>
          <Button
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
