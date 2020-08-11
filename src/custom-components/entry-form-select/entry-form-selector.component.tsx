import React from 'react';

import './entry-form-selector.scss';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Transition, animated } from 'react-spring/renderprops';
import Title from 'antd/lib/typography/Title';
import { IEntryOption } from './entry-form-select.interfaces';
import { EntryType } from '../../pages/constants';

interface IProps {
  options: IEntryOption[];
  onSelect: (type: EntryType) => void;
}

@observer
export class EntryFormSelector extends React.Component<IProps> {

  @observable
  private options: IEntryOption[] = [];

  private handleMouseEnter = () => {
    this.setOptions(this.props.options || []);
  }

  private handleMouseLeave = () => {
    this.setOptions([]);
  }

  private handleEntryClick = (type: EntryType) => {
    this.props.onSelect(type);
    this.setOptions([]);
  }

  @action.bound
  private setOptions(options: IEntryOption[]) {
    this.options = options;
  }

  public render() {
    return (
      <div className="entryFormSelector" onMouseLeave={this.handleMouseLeave} >
        <div className="mainSelector" onMouseEnter={this.handleMouseEnter}>
          <Title level={2} className="text">New entry</Title>
          <Transition
            items={this.options}
            keys={item => item.label}
            from={{opacity: 0}}
            enter={{ opacity: 1}}
            leave={{ opacity: 0}}
            trail={70}
            config={{
              tension: 300,
            }}
          >
            {item => (style) => {
              return item ? (
                <animated.div className={item.className}
                  style={style}
                  onClick={() => this.handleEntryClick(EntryType[item.label as EntryType])}>
                  <div className="icon">{item.icon}</div>
                  <div className='text'>{item.label}</div>
                </animated.div>
              ): null;
            }}
          </Transition>
        </div>
      </div>
    );
  }
}