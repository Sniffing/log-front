import React from 'react';

import './entry-form-selector.scss';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Transition, animated } from 'react-spring/renderprops';
import Title from 'antd/lib/typography/Title';
import { IEntryOption } from './entry-form-select.interfaces';

interface IProps {
  options: IEntryOption[];
}

@observer
export class EntryFormSelector extends React.Component<IProps> {

  @observable
  private options: IEntryOption[] = [];

  @action
  private handleMouseEnter = () => {
    this.options = this.props.options || [];
  }

  @action
  private handleMouseLeave = () => {
    this.options = [];
  }

  public render() {
    return (
      <div className="entryFormSelector" onMouseLeave={this.handleMouseLeave} >
        <div className="mainSelector" onMouseEnter={this.handleMouseEnter}>
          <Title level={2} className="text">New entry</Title>
          <Transition
            items={this.options}
            keys={item => item.label}
            from={{opacity: 1}}
            enter={{ opacity: 1}}
            leave={{ opacity: 1}}
            trail={70}
            config={{
              tension: 300,
            }}
          >
            {item => (style) => {
              return item ? (
                <animated.div className={item.className} style={style}>
                  <span>{item.label}</span>
                  {item.icon}
                </animated.div>
              ): null;
            }}
          </Transition>
        </div>
      </div>
    );
  }
}