import React from 'react';
import Form, { FormInstance } from 'antd/lib/form';
import { EventFormFieldsEnum, eventFormFields, EntryFormFieldsConfigs } from './event-form-fields';
import { Input, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

export class LifeEventPage extends React.Component {

  private formRef = React.createRef<FormInstance>();

  private getFormItem = (elem: EventFormFieldsEnum) => {
    const config = EntryFormFieldsConfigs[elem];
    let formComponent = <Input/>;

    switch(elem) {
    case EventFormFieldsEnum.NAME: break;
    case EventFormFieldsEnum.DESCRIPTION: 
      formComponent = <TextArea autoSize={{ minRows:5, maxRows:10 }}/>;
      break;
    case EventFormFieldsEnum.DATE: break;
    case EventFormFieldsEnum.NATURE: 
      
      break;
    case EventFormFieldsEnum.INTENSITY: break;
    }
    
    return (
      <Form.Item label={config.label}>
        {formComponent}
      </Form.Item>
    );
  }

  public render() {
    return (
      <Form ref={this.formRef}>
        {eventFormFields.map(this.getFormItem)}

        <Form.Item noStyle>
          <Button type="primary" htmlType="submit">Save Event</Button>
        </Form.Item> 
      </Form>
    );
  }
}