import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Card, Modal } from 'antd';
import { CardProps } from 'antd/lib/card';

import './expanding-container.scss';
import Title from 'antd/lib/typography/Title';

@observer
export class ExpandingContainer extends React.Component<CardProps> {

  @observable
  private visible = true;

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

  public render() {
    const {title, children, ...rest} = this.props;
    return (
      <>
        <Card
          {...rest}
          hoverable
          onClick={this.toggleModal}
          className="minimised"
        >
          {title}
        </Card>
        <Modal
          keyboard
          closable={false}
          visible={this.visible}
          onCancel={this.toggleModal}
          footer={null}
          className="expanded"
          title={this.title}
        >
          {children}
        </Modal>
      </>
    );
  }
}