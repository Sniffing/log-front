import React from 'react';
import { Input, DatePicker, Radio, Form, Tooltip, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { inject, observer } from 'mobx-react';
import { LifeEventStore } from '../../stores/lifeEventStore';
import { NumbersOnlySelect } from '../../custom-components';
import { EventFormObject } from './EventFormObject';
import { EventFormErrorObject } from './EventFormErrorObject';
import { isDateDisabled } from '../../App.utils';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

interface IProps {
  lifeEventStore?: LifeEventStore;
  formObject: EventFormObject;
  formErrorObject: EventFormErrorObject;
}

@inject('lifeEventStore')
@observer
export class LifeEventEntry extends React.Component<IProps> {

  private get intensityLabel() {
    return (
      <Tooltip title={'10 should be huge say hospitalised vs getting married 5 is medium such as switched jobs 1 is a minor struggle that would cause stress, e.g. moving house'}>
        <span>
          Intensity {' '}
          <InfoCircleOutlined />
        </span>
      </Tooltip>
    );
  }

  public render() {
    const {formObject, formErrorObject} = this.props;
    if (!this.props.lifeEventStore) return <Spin></Spin>;
    return (
      <div>
        <Form labelCol={{span: 6}} >
          <Form.Item label="Date" {...formErrorObject.getFormItemError('date')}>
            <DatePicker
              disabledDate={isDateDisabled}
              value={formObject.date ? moment(formObject.date * 1000): undefined}
              onChange={(date) => formObject.setDate(date.unix())}
            />
          </Form.Item>
          <Form.Item label="Event name" {...formErrorObject.getFormItemError('name')}>
            <Input
              value={formObject.name}
              onChange={(e) => formObject.setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Description" {...formErrorObject.getFormItemError('description')}>
            <TextArea
              autoSize={{ minRows:5, maxRows:10 }}
              value={formObject.description}
              onChange={(e) => formObject.setDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Nature" {...formErrorObject.getFormItemError('nature')}>
            <Radio.Group
              value={formObject.nature}
              onChange={(e) => formObject.setNature(e.target.value)}
            >
              <Radio value='good'>Good</Radio>
              <Radio value='bad'>Bad</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={this.intensityLabel} {...formErrorObject.getFormItemError('intensity')}>
            <NumbersOnlySelect value={formObject.intensity} onChange={formObject.setIntensity}/>
          </Form.Item>
        </Form>
      </div>
    );
  }
}