import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Card, Modal } from 'antd';
import { CardProps } from 'antd/lib/card';

import './expanding-container.less';
import Title from 'antd/lib/typography/Title';

interface IProps extends CardProps {
  expandedComponent?: React.ReactNode;
}

@observer
export class ExpandingContainer extends React.Component<IProps> {

  @observable
  private visible = false;

  @action.bound
  private toggleModal() {
    if (!this.props.expandedComponent) {
      return;
    }

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
    const {children, bordered = false, expandedComponent, ...rest} = this.props;
    return (
      <>
        <Card
          {...rest}
          bordered={bordered}
          hoverable
          title={this.title}
          onClick={this.toggleModal}
          className="card"
        >
          {children}
        </Card>

        <Modal
          title={this.title}
          visible={this.visible}
          closable={true} footer={null}
          className="modal"
          onCancel={this.toggleModal}>
          {expandedComponent}
        </Modal>
      </>
    );
  }
}