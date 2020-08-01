import React, { RefObject } from 'react';
import { LifeEventFormFieldsEnum, eventFormFields, EntryFormFieldsConfigs } from './life-event-form-fields';
import { Input, DatePicker, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isDateDisabled } from '.';
import { inject, observer } from 'mobx-react';
import { LifeEventStore } from '../../stores/lifeEventStore';
import { NumbersOnlySelect } from '../../custom-components';
import Form, { FormInstance } from 'antd/lib/form';

interface IProps {
  lifeEventStore?: LifeEventStore;
  formRef: RefObject<FormInstance>;
}

@inject('lifeEventStore')
@observer
export class LifeEventEntry extends React.Component<IProps> {
  private createFormItem = (elem: LifeEventFormFieldsEnum) => {
    const config = EntryFormFieldsConfigs[elem];
    let formComponent = <Input/>;

    switch(elem) {
    case LifeEventFormFieldsEnum.NAME: break;
    case LifeEventFormFieldsEnum.DESCRIPTION:
      formComponent = <TextArea autoSize={{ minRows:5, maxRows:10 }}/>;
      break;
    case LifeEventFormFieldsEnum.DATE:
      formComponent = <DatePicker disabledDate={isDateDisabled}></DatePicker>;
      break;
    case LifeEventFormFieldsEnum.NATURE:
      formComponent =
          <Radio.Group>
            <Radio value='good'>Good</Radio>
            <Radio value='bad'>Bad</Radio>
          </Radio.Group>;
      break;
    case LifeEventFormFieldsEnum.INTENSITY:
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
        <Form ref={this.props.formRef} labelCol={{span: 6}} >
          {eventFormFields.map(this.createFormItem)}
        </Form>
      </div>
    );
  }
}