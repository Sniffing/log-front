import React, { Component } from 'react';
import { Button, Card, Spin, Result } from 'antd';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { RootStore } from '../stores/rootStore';

import './memory.scss';
import { Utils } from '../App.utils';

interface IProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
export class MemoryPage extends Component<IProps> {
  @observable
  private currentIndex = 0;

  public componentDidMount() {
    this.props.rootStore?.fetchMemory();
  }

  @action
  private rollNewMemory = () => {
    if (!this.props.rootStore?.memories) return;

    let random = Math.random();
    random *= this.props.rootStore.memories.length - 1;
    this.currentIndex = random;
  };

  @computed 
  private get memory() {
    const memories = this.props.rootStore?.memories;
    const memory = memories ? memories[this.currentIndex] : undefined;

    return memory ? memory : {date: '', text: ''};
  }

  public render() {
    return (
      <div className='memory'>
        <Button className='rollButton' onClick={this.rollNewMemory}>
          Random Memory
        </Button>
        
        {this.props.rootStore?.fetchingMemory?.case({
          fulfilled: () => 
            <Card title={`${Utils.fromReversedDate(this.memory.date)}`} className='card'>
              <p>{this.memory.text}</p>
            </Card>,
          pending: () => <Spin/>,
          rejected: () => <Result title={'Error fetching memories'} status={500}/>,
        })}   
      </div>
    );
  }
}
