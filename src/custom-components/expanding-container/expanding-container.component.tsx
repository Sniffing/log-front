import React, { CSSProperties } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'antd';
import { Transition } from 'react-spring/renderprops';

interface IProps {
  temp?: string;
}

@observer
export class ExpandingContainer extends React.Component<IProps> {

  @observable
  private expanded = false;

  @action.bound
  private toggle() {
    console.log('toggle');
    this.expanded = !this.expanded;
  }

  public render() {
    return (
      <div onClick={this.toggle} style={{width: '100%', height: '100%'}}>
        <Transition
          from={{ opacity: 0, position: 'absolute' } as CSSProperties}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
          items={this.expanded}>
          {show => props => !show ? (
            <Card title="minimised" style={props}>
                Minimised
            </Card>) : (
            <Card title="expanded" style={{
              textAlign: 'center',
              width: '90%',
              height: '90%',
              ...props}}>
                Expanded
            </Card>
          )}
        </Transition>
      </div>);
  }
}