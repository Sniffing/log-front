import React, { RefObject } from 'react';
import { LifeEventFormFieldsEnum, EntryFormFieldsConfigs } from './life-event-form-fields';
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
  public render() {
    if (!this.props.lifeEventStore) return <></>;
    return (
      <div>
        <Form ref={this.props.formRef} labelCol={{span: 6}} >
          <Form.Item {...EntryFormFieldsConfigs[LifeEventFormFieldsEnum.DATE]}>
            <DatePicker disabledDate={isDateDisabled}></DatePicker>
          </Form.Item>
          <Form.Item {...EntryFormFieldsConfigs[LifeEventFormFieldsEnum.NAME]}>
            <Input/>
          </Form.Item>
          <Form.Item {...EntryFormFieldsConfigs[LifeEventFormFieldsEnum.DESCRIPTION]}>
            <TextArea autoSize={{ minRows:5, maxRows:10 }}/>;
          </Form.Item>
          <Form.Item {...EntryFormFieldsConfigs[LifeEventFormFieldsEnum.NATURE]}>
            <Radio.Group>
              <Radio value='good'>Good</Radio>
              <Radio value='bad'>Bad</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...EntryFormFieldsConfigs[LifeEventFormFieldsEnum.INTENSITY]}>
            <NumbersOnlySelect/>
          </Form.Item>
        </Form>
      </div>
    );
  }
}