import React, { RefObject } from 'react';
import { inject, observer } from 'mobx-react';
import Form, { FormInstance } from 'antd/lib/form';
import { calorieFormFields, createFormItem, ECalorieEntryTabs, CalorieFormFieldsEnum } from '.';
import { Button, message, Tabs } from 'antd';
import Dragger, { DraggerProps } from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { UploadChangeParam, RcFile } from 'antd/lib/upload';
import { observable, action, computed } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { CalorieStore } from '../../stores/calorieStore';
import { CSVUpload } from './csv-upload';

const { TabPane } = Tabs;

interface IProps {
  calorieStore?: CalorieStore;
  formRef: RefObject<FormInstance>;
}

@inject('calorieStore')
@observer
export class CalorieEntry extends React.Component<IProps> {

  private handleTabChange = (tabKey: string) => {
    if (tabKey === ECalorieEntryTabs.CSV) {
      this.props.formRef.current?.setFieldsValue({
        [CalorieFormFieldsEnum.CALORIES]: null,
        [CalorieFormFieldsEnum.DATE]: null,
      });
    } else if (tabKey === ECalorieEntryTabs.FORM) {
      this.props.formRef.current?.setFieldsValue({
        [CalorieFormFieldsEnum.CSV]: null,
      });
    }
  }

  @observable
  private csvFile: RcFile | undefined;

  @action.bound
  private handleCSVupload(file: RcFile | undefined) {
    this.csvFile = file;
  }

  public render() {
    if (!this.props.calorieStore) return <></>;

    return (
      <Form ref={this.props.formRef} labelCol={{span: 4}}>
        <Tabs defaultActiveKey={ECalorieEntryTabs.FORM} animated onChange={this.handleTabChange}>
          <TabPane tab="Entry" key={ECalorieEntryTabs.FORM}>
            {calorieFormFields.map(createFormItem)}
          </TabPane>
          <TabPane tab="Upload CSV" key={ECalorieEntryTabs.CSV}>
            <div style={{margin: '20px', textAlign: 'center'}}>
              <Form.Item name={CalorieFormFieldsEnum.CSV}>
                <CSVUpload value={this.csvFile} onChange={this.handleCSVupload}/>
              </Form.Item>
            </div>
          </TabPane>
        </Tabs>
      </Form>
    );
  }
}