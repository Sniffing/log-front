import React from 'react';
import { inject, observer } from 'mobx-react';
import Form, { FormInstance } from 'antd/lib/form';
import { ICalorieEntryFormValues, calorieFormFields, createFormItem } from '.';
import { convertFormValuesToCalorieEntry } from './calorie.helper';
import { Card, Button, message } from 'antd';
import Dragger, { DraggerProps } from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { UploadChangeParam, RcFile } from 'antd/lib/upload';
import { observable, action, computed } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { CalorieStore } from '../stores/calorieStore';
import { Store } from 'antd/lib/form/interface';

interface IProps {
  calorieStore: CalorieStore;
}

@inject('calorieStore')
@observer
export class CalorieEntryPage extends React.Component<IProps> {

  private formRef = React.createRef<FormInstance>();

  @observable
  private csvFile: RcFile | undefined;

  @observable
  private uploadingCSV: IPromiseBasedObservable<Response> | undefined;

  private handleSaveEventClick = (value: Store) => {
    const formValues = value as ICalorieEntryFormValues;
    const event = convertFormValuesToCalorieEntry(formValues);
    this.props.calorieStore?.saveCalorieEntry(event);
  }

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
    if (this.csvFile) {
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
    const loading = this.props.calorieStore.savingCalorieEntry?.state === 'pending';
    return (
      <>
        <Card style={{margin: '20px'}} loading={loading}>
          <Form ref={this.formRef} labelCol={{span: 4}} onFinish={this.handleSaveEventClick}>
            {calorieFormFields.map(createFormItem)}

            <Form.Item style={{textAlign:'center'}}>
              <Button type="primary" htmlType="submit">Save Entry</Button>
            </Form.Item>
          </Form>
        </Card>
        <Card style={{margin: '20px', textAlign: 'center'}}>
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
        </Card>
      </>
    );
  }
}