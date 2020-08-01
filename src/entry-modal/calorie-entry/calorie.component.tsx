import React, { RefObject } from 'react';
import { inject, observer } from 'mobx-react';
import Form, { FormInstance } from 'antd/lib/form';
import { calorieFormFields, createFormItem } from '.';
import { Button, message } from 'antd';
import Dragger, { DraggerProps } from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { UploadChangeParam, RcFile } from 'antd/lib/upload';
import { observable, action, computed } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { CalorieStore } from '../../stores/calorieStore';

interface IProps {
  calorieStore?: CalorieStore;
  formRef: RefObject<FormInstance>;
}

@inject('calorieStore')
@observer
export class CalorieEntry extends React.Component<IProps> {

  @observable
  private csvFile: RcFile | undefined;

  @observable
  private uploadingCSV: IPromiseBasedObservable<Response> | undefined;

  @action
  private setCSV = (file: RcFile) => {
    this.csvFile = file;
  }

  private checkFile = (file: RcFile): boolean | PromiseLike<void> => {
    if (file.type !== 'text/csv') {
      message.error('Can only upload csvs');
      return false;
    }

    this.setCSV(file);
    return false;
  }

  private uploadFile = () => {
    if (this.props.calorieStore && this.csvFile) {
      this.uploadingCSV = fromPromise(this.props.calorieStore.saveCaloriesFromCSV(this.csvFile));
    }
  }

  @action
  private removeFile = () => {
    this.csvFile = undefined;
  }

  @computed
  private get fileList(): RcFile[] {
    return this.csvFile ? [this.csvFile] : [];
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
          console.log(info.file);
        }
      },
      disabled: this.uploadingCSV?.state === 'pending',
    };
  }

  public render() {
    if (!this.props.calorieStore) return <></>;

    return (
      <>
        <Form ref={this.props.formRef} labelCol={{span: 4}}>
          {calorieFormFields.map(createFormItem)}
        </Form>

        <div style={{margin: '20px', textAlign: 'center'}}>
          <Dragger {...this.uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Upload .csv file</p>
          </Dragger>
          <Button
            type="primary"
            style={{marginTop: '20px'}}
            onClick={this.uploadFile}
            disabled={!this.csvFile || this.uploadingCSV?.state === 'pending'}>
            Upload
          </Button>
        </div>
      </>
    );
  }
}