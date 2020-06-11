import React, { Component } from 'react';
import { Button, Card, Spin } from 'antd';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';

import './memory.scss';
import { Utils } from '../App.utils';
import { Rejected } from '../custom-components';
import { LogEntryStore } from '../stores/logEntryStore';

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

  public render() {
    return (
      <div className='memory'>
        {this.props.logEntryStore?.fetchingMemory?.case({
          fulfilled: () =>
            <Card title={`${Utils.fromReversedDate(this.memory.date)}`} className='card'>
              <p>{this.memory.text}</p>
            </Card>,
          pending: () => <Spin/>,
          rejected: () => <Rejected message="Unable to fetch memories"/>,
        })}

        <Button className='rollButton' onClick={this.rollNewMemory} disabled={!!this.memory}>
          Random Memory
        </Button>
      </div>
    );
  }
}
