import React from 'react';
import { Modal, Button, Checkbox } from 'antd';
import { observer } from 'mobx-react';
import { ModalProps } from 'antd/lib/modal';
import { observable, action } from 'mobx';
import Title from 'antd/lib/typography/Title';
import { IPromiseBasedObservable, fromPromise, PENDING } from 'mobx-utils';

export interface IEntryFormModalProps extends ModalProps {
  keepOpen?: boolean;
  onOk: () => Promise<void>;
  onCancel: () => void;
}

@observer
export class EntryFormModal extends React.Component<IEntryFormModalProps> {

  @observable
  private keepOpen = false;

  @observable
  private saving: IPromiseBasedObservable<void> = fromPromise(Promise.resolve());

  public constructor(props: IEntryFormModalProps) {
    super(props);
    this.setKeepOpen(props.keepOpen || false);
  }

  @action.bound
  private handleKeepOpenToggle() {
    this.setKeepOpen(!this.keepOpen);
  }

  @action.bound
  private setKeepOpen(state: boolean) {
    this.keepOpen = state;
  }

  @action
  private handleSubmit = () => {
    const { onOk } = this.props;

    if (onOk) {
      this.saving = fromPromise(onOk());
    }

    if (!this.keepOpen) {
      this.handleCancel();
    }
  }

  private handleCancel = () => {
    const {onCancel} = this.props;

    if (onCancel) {
      onCancel();
    }
  }

  private get modalFooter() {
    return [
      <Checkbox key="keepOpen"
        checked={this.keepOpen}
        onChange={this.handleKeepOpenToggle}>
          Keep open?
      </Checkbox>,
      <Button key="cancel" onClick={this.handleCancel}>Close</Button>,
      <Button key="submit" type="primary" loading={this.saving.state === PENDING} onClick={this.handleSubmit}>Save</Button>,
    ];
  }

  public render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {onOk, keepOpen, title, ...rest} = this.props;

    return (
      <Modal title={<Title level={2} style={{padding: 0, margin: 0}}>{title}</Title>} footer={this.modalFooter} {...rest}>
        {this.props.children}
      </Modal>
    );
  }
}