import React from 'react';

import './entry-form-selector.scss';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Transition, animated } from 'react-spring/renderprops';

@observer
export class EntryFormSelector extends React.Component {

  @observable
  private options: string[] = [];

  @action
  private handleMouseEnter = () => {
    this.options = ['firstChoice','secondChoice','thirdChoice'];
  }

  @action
  private handleMouseLeave = () => {
    this.options = [];
  }

  public render() {
    return (
      <div className="entryFormSelector" onMouseLeave={this.handleMouseLeave} >
        <div className="mainSelector" onMouseEnter={this.handleMouseEnter}>
          <Transition
            items={this.options}
            from={{opacity: 0}}
            enter={{ opacity: 1}}
            leave={{ opacity: 0}}
            trail={70}
            config={{
              tension: 300,
            }}
          >
            {item => ({opacity}) => (
              <animated.div className={item} style={{opacity}}/>
            )}
          </Transition>
        </div>
      </div>
    );
  }
}