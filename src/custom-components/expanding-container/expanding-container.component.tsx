import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card, Modal } from 'antd';
import { CardProps } from 'antd/lib/card';

import './expanding-container.scss';

@observer
export class ExpandingContainer extends React.Component<CardProps> {

  @observable
  private visible = false;

  @action.bound
  private toggleModal() {
    this.visible = !this.visible;
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
          <span>{title}</span>
        </Card>
        <Modal
          keyboard
          closable
          visible={this.visible}
          onCancel={this.toggleModal}
          footer={null}
          className="expanded"
        >
          {children}
        </Modal>
      </>
    );
  }
}