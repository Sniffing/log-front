import React from 'react';
import { Fade } from './fade/fade.component';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

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
      <div style={{backgroundColor: 'green', height:'100%', width:'100%'}} onClick={this.toggle}>
        <Fade
          show={!this.expanded}
          from={{ opacity: 0, transform: 'translate3d(0,100px,0)' }}
          enter={{ opacity: 1, transform: 'translate3d(0,0px,0)' }}
          leave={{ opacity: 0, transform: 'translate3d(0,-50px,0)' }}
        >
          <div>
            fuck
          </div>
        </Fade>
        <Fade
          show={this.expanded}
          from={{ opacity: 0, transform: 'translate3d(0,100px,0)' }}
          enter={{ opacity: 1, transform: 'translate3d(0,0px,0)' }}
          leave={{ opacity: 0, transform: 'translate3d(0,-50px,0)' }}
        >
          <div>✌️</div>
        </Fade>
      </div>
    );
  }
}