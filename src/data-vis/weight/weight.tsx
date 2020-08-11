import React from 'react';

import { WeightLineGraph } from '.';
import { inject } from 'mobx-react';
import { LogEntryStore } from '../../stores/logEntryStore';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
export class WeightPage extends React.Component<IProps> {
  render() {
    return (
      <div className="weight-page">
        <WeightLineGraph logEntryStore={this.props.logEntryStore} />
      </div>
    );
  }
}
