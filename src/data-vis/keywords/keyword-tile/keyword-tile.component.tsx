import { inject, observer } from 'mobx-react';
import React from 'react';
import { KeywordView } from '..';
import { ExpandingContainer } from '../../../custom-components/expanding-container/expanding-container.component';
import { LogEntryStore } from '../../../stores/logEntryStore';

interface IProps {
  logEntryStore?: LogEntryStore
}

@inject('logEntryStore')
@observer
export class KeywordTile extends React.Component<IProps> {

  public render(): React.ReactNode {
    return (
      <ExpandingContainer
        title="Keywords"
        expandedComponent={
          <KeywordView logEntryStore={this.props.logEntryStore}/>
        }
      >
        <div>Keywords</div>
      </ExpandingContainer>
    );
  }
}