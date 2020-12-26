import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

import './expanding-container.less';
import Title from 'antd/lib/typography/Title';

@observer
export class ExpandingContainer extends React.Component<CardProps> {

  @observable
  private visible = false;

  @action.bound
  private toggleModal() {
    this.visible = !this.visible;
  }

  @computed
  private get title() {
    return (
      <Title className="title" level={2}>
        {this.props.title}
      </Title>
    );
  }

  public render(): React.ReactNode {
    const {children, ...rest} = this.props;
    return (
      <Card
        {...rest}
        hoverable
        title={this.title}
        onClick={this.toggleModal}
        className="card"
      >
        {children}
      </Card>
    );
  }
}