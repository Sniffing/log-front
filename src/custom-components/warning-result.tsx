import React from 'react';
import { Result } from 'antd';
import { ResultProps } from 'antd/lib/result';

type IProps = ResultProps

export class WarningResult extends React.Component<IProps> {
  public render() {
    return(
      <Result status="warning" title={this.props.title}/>
    );
  }
}