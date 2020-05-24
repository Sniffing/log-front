import React from 'react';
import { RootStore } from '../stores/rootStore';
import { inject, observer } from 'mobx-react';
import Form, { FormInstance } from 'antd/lib/form';
import { ICalorieEntryFormValues, CalorieFormFieldsEnum, calorieFormFields, isDateDisabled, CalorieFormFieldsConfigs } from '.';
import { convertFormValuesToCalorieEntry } from './calorie.helper';
import { Input, DatePicker, Card, Button } from 'antd';

interface IProps {
  rootStore: RootStore;
}

@inject('rootStore')
@observer
export class CalorieEntryPage extends React.Component<IProps> {

  private formRef = React.createRef<FormInstance>();

  private handleSaveEventClick = (value: any) => {
    const formValues = value as ICalorieEntryFormValues;
    console.log(value, formValues);
    const event = convertFormValuesToCalorieEntry(formValues);
    this.props.rootStore?.saveCalorieEntry(event);
  }

  private createFormItem = (elem: CalorieFormFieldsEnum) => {
    const config = CalorieFormFieldsConfigs[elem];
    let formComponent = <Input/>;

    switch(elem) {
    case CalorieFormFieldsEnum.CALORIES:
      break;
    case CalorieFormFieldsEnum.DATE:
      formComponent = <DatePicker disabledDate={isDateDisabled}></DatePicker>;
      break;
    }

    const rules = [];
    if (config.required) {
      rules.push({
        required: true,
        message: 'Mandatory field'
      });
    }

    return (
      <Form.Item label={config.label} name={config.name} rules={rules}>
        {formComponent}
      </Form.Item>
    );
  }

  public render() {
    const loading = this.props.rootStore.savingCalorieEntry?.state === 'pending';
    return (
      <Card style={{margin: '20px'}} loading={loading}>
        <Form ref={this.formRef} labelCol={{span: 4}} onFinish={this.handleSaveEventClick}>
          {calorieFormFields.map(this.createFormItem)}

          <Form.Item style={{textAlign:'center'}}>
            <Button type="primary" htmlType="submit">Save Entry</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}