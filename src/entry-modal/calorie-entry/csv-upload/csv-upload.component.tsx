import React from 'react';
import Dragger, { DraggerProps } from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { IPromiseBasedObservable } from 'mobx-utils';
import { message } from 'antd';

interface IProps {
  value?: RcFile;
  onChange?: (file: RcFile | undefined) => void;
}

@observer
export class CSVUpload extends React.Component<IProps> {
  @observable
  private uploadingCSV: IPromiseBasedObservable<Response> | undefined;

  @action
  private setCSV = (file: RcFile | undefined) => {
    if (this.props.onChange)
      this.props.onChange(file);
  }

  private checkFile = (file: RcFile): boolean | PromiseLike<void> => {
    if (file.type !== 'text/csv') {
      message.error('Can only upload csvs');
      return false;
    }

    this.setCSV(file);
    return false;
  }

  @action
  private removeFile = () => {
    this.setCSV(undefined);
  }

  @computed
  private get fileList(): RcFile[] {
    return this.props.value ? [this.props.value] : [];
  }

  @computed
  private get uploadProps(): DraggerProps {
    return {
      name: 'file',
      accept: '.csv',
      multiple: false,
      beforeUpload: this.checkFile,
      onRemove: this.removeFile,
      fileList: this.fileList,
      onChange: (info: UploadChangeParam) => {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.info(info.file);
        }
      },
      disabled: this.uploadingCSV?.state === 'pending',
    };
  }

  public render() {
    return (
      <Dragger {...this.uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Upload .csv file</p>
      </Dragger>
    );
  }
}