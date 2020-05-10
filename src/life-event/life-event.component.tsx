import React from 'react';
import Form, { FormInstance } from 'antd/lib/form';
import { EventFormFieldsEnum, eventFormFields, EntryFormFieldsConfigs } from './event-form-fields';
import { Input, Button, Card, DatePicker, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isDateDisabled, nature } from '.';
import { Moment } from 'moment';
import { inject, observer } from 'mobx-react';
import { RootStore } from '../stores/rootStore';
import { convertFormValuesToLifeEvent } from './life-event.helper';
import { NumbersOnlySelect } from '../custom-components';

export interface ILifeEventFormValues {
  [EventFormFieldsEnum.NAME]: string;
  [EventFormFieldsEnum.DESCRIPTION]: string;
  [EventFormFieldsEnum.DATE]: Moment;
  [EventFormFieldsEnum.NATURE]: nature;
  [EventFormFieldsEnum.INTENSITY]: number;
}

interface IProps {
  rootStore: RootStore;
}

@inject('rootStore')
@observer
export class LifeEventPage extends React.Component<IProps> {

  private formRef = React.createRef<FormInstance>();

  private handleSaveEventClick = (value: any) => {
    const formValues = value as ILifeEventFormValues;
    console.log(value, formValues);
    const event = convertFormValuesToLifeEvent(formValues);
    this.props.rootStore?.saveLifeEvent(event);
  }

  private createFormItem = (elem: EventFormFieldsEnum) => {
    const config = EntryFormFieldsConfigs[elem];
    let formComponent = <Input/>;

    switch(elem) {
    case EventFormFieldsEnum.NAME: break;
    case EventFormFieldsEnum.DESCRIPTION: 
      formComponent = <TextArea autoSize={{ minRows:5, maxRows:10 }}/>;
      break;
    case EventFormFieldsEnum.DATE: 
      formComponent = <DatePicker disabledDate={isDateDisabled}></DatePicker>;
      break;
    case EventFormFieldsEnum.NATURE: 
      formComponent = 
        <Radio.Group>
          <Radio value='good'>Good</Radio>
          <Radio value='bad'>Bad</Radio>
        </Radio.Group>;
      break;
    case EventFormFieldsEnum.INTENSITY: 
      formComponent = <NumbersOnlySelect/>;
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
    const loading = this.props.rootStore.savingEntry?.state === 'pending';
    return (
      <Card style={{margin: '20px'}} loading={loading}>
        <Form ref={this.formRef} labelCol={{span: 4}} onFinish={this.handleSaveEventClick}>
          {eventFormFields.map(this.createFormItem)}

          <Form.Item style={{textAlign:'center'}}>
            <Button type="primary" htmlType="submit">Save Event</Button>
          </Form.Item> 
        </Form>
      </Card>
    );
  }
}