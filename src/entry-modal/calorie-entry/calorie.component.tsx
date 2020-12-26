import React from 'react';
import { inject, observer } from 'mobx-react';
import Form from 'antd/lib/form';
import { DatePicker, Input, Spin, Tabs } from 'antd';
import { CalorieStore } from '../../stores/calorieStore';
import { CSVUpload } from './csv-upload';
import { CalorieFormObject } from './CalorieFormObject';
import { ECalorieEntryTabs } from '.';
import { Moment } from 'moment';
import moment from 'moment';
import { CalorieFormErrorObject } from './CalorieFormErrorObject';
import { isDateDisabled } from '../../App.utils';

const { TabPane } = Tabs;

interface IProps {
  calorieStore?: CalorieStore;
  formObject: CalorieFormObject;
  formErrorObject: CalorieFormErrorObject;
}

@inject('calorieStore')
@observer
export class CalorieEntry extends React.Component<IProps> {

  private handleTabChange = (tabKey: string): void => {
    const {formObject} = this.props;
    if (tabKey === ECalorieEntryTabs.CSV) {
      formObject.clearEntryFields();
    } else if (tabKey === ECalorieEntryTabs.FORM) {
      formObject.clearCSVFile();
    }
  }

  public render(): React.ReactNode {
    const {formObject, formErrorObject} = this.props;

    if (!this.props.calorieStore) return <Spin/>;

    return (
      <Form labelCol={{span: 4}}>
        <Tabs defaultActiveKey={ECalorieEntryTabs.FORM} animated onChange={this.handleTabChange}>
          <TabPane tab="Entry" key={ECalorieEntryTabs.FORM}>
            <Form.Item label="Date" {...formErrorObject.getFormItemError('date')}>
              <DatePicker
                value={formObject.date ? moment(formObject.date * 1000) : undefined}
                onChange={(date: Moment) => formObject.setDate(date?.unix())}
                disabledDate={isDateDisabled}/>
            </Form.Item>
            <Form.Item label="Calories" {...formErrorObject.getFormItemError('calories')}>
              <Input
                type="number"
                value={formObject?.calories}
                onChange={({target : {value}}) => formObject.setCalories(Number(value))}
              />
            </Form.Item>
          </TabPane>
          <TabPane tab="Upload CSV" key={ECalorieEntryTabs.CSV}>
            <div style={{margin: '20px', textAlign: 'center'}}>
              <Form.Item name="CSV" {...formErrorObject.getFormItemError('csvFile')}>
                <CSVUpload value={formObject.csvFile} onChange={formObject.setCSV}/>
              </Form.Item>
            </div>
          </TabPane>
        </Tabs>
      </Form>
    );
  }
}