import React from 'react';
import Form, { FormInstance } from 'antd/lib/form';
import { EventFormFieldsEnum, eventFormFields, EntryFormFieldsConfigs } from './event-form-fields';
import { Input, Button, Card, DatePicker, Radio, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isDateDisabled, ILifeEventFormValues } from '.';
import { inject, observer } from 'mobx-react';
import { convertFormValuesToLifeEvent } from './life-event.helper';
import { NumbersOnlySelect } from '../custom-components';
import { LifeEventStore } from '../stores/lifeEventStore';

interface IProps {
  lifeEventStore?: LifeEventStore;
}

@inject('lifeEventStore')
@observer
export class LifeEventEntryPage extends React.Component<IProps> {
  private formRef = React.createRef<FormInstance>();

  private handleSaveEventClick = async (values: any) => {
    const event = convertFormValuesToLifeEvent(values as ILifeEventFormValues);

    try {
      await this.props.lifeEventStore?.saveLifeEvent(event);
      this.formRef.current?.resetFields();
    } catch (error) {
      message.error('Could not save entry');
      console.error(error);
    }
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
      <Form.Item label={config.label} name={config.name} rules={rules} key={config.name}>
        {formComponent}
      </Form.Item>
    );
  }

  public render() {
    if (!this.props.lifeEventStore) return <></>;
    return (
      <div>
        <Card style={{margin: '20px'}} loading={this.props.lifeEventStore.isSaving}>
          <Form ref={this.formRef} labelCol={{span: 4}} onFinish={this.handleSaveEventClick}>
            {eventFormFields.map(this.createFormItem)}

            <Form.Item style={{textAlign:'center'}}>
              <Button type="primary" htmlType="submit">Save Event</Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}