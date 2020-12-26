import * as React from 'react';
import { inject, observer } from 'mobx-react';
import {
  dateFormat,
} from '.';
import {
  Form,
  DatePicker,
  Input, Tag
} from 'antd';
import moment, { Moment } from 'moment';
import TextArea from 'antd/lib/input/TextArea';

import { flatten } from 'lodash';

import { LogEntryStore } from '../../stores/logEntryStore';
import { action, observable } from 'mobx';
import { LogFormObject } from './LogFormObject';
import { LogFormErrorObject } from './LogFormErrorObject';

interface IProps {
  logEntryStore?: LogEntryStore;
  formObject: LogFormObject;
  formErrorObject: LogFormErrorObject;
}

@inject('logEntryStore')
@observer
export class LogEntry extends React.Component<IProps> {

  @observable
  private tagInput = '';

  public async componentDidMount(): Promise<void> {
    const { logEntryStore } = this.props;
    await logEntryStore?.fetchingDates;
  }

  public render(): React.ReactNode {
    const {formObject, formErrorObject} = this.props;
    return (
      <Form
        labelCol={{ span: 4 }}
        labelAlign="right"
        wrapperCol={{ offset: 1, span: 19 }}
      >
        <Form.Item label="Date" {...formErrorObject.getFormItemError('dateState')}>
          <DatePicker
            value={moment(formObject.dateState.date, dateFormat)}
            disabledDate={this.disableDatesAfterLastEntry}
            onChange={(date) => formObject.setDate(date.format(dateFormat))}
          />
        </Form.Item>
        <Form.Item label="Feelings" {...formErrorObject.getFormItemError('keywordsState')}>
          <Input value={this.tagInput} onChange={this.updateTagInput} onPressEnter={this.addTag}/>
          {formObject.keywordsState.keywords.map(tag => <Tag key={tag} color='blue'>{tag}</Tag>)}
        </Form.Item>
        <Form.Item label="Weight" {...formErrorObject.getFormItemError('entryMetricState')}>
          <Input
            type="number"
            value={formObject.entryMetricState.weight}
            onChange={({target}) => formObject.setWeight(Number(target.value))}
          />
        </Form.Item>
        <Form.Item label="Thoughts" {...formErrorObject.getFormItemError('textState')}>
          <TextArea
            value={formObject.textState.data}
            maxLength={1500}
            onChange={({target: {value}}) => formObject.setThoughts(value)}
            rows={6}
          />
        </Form.Item>
      </Form>
    );
  }

  @action.bound
  private updateTagInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.tagInput = event.target.value;
  }

  @action
  private addTag = () => {
    const {formObject} = this.props;
    const tags = (formObject.keywordsState?.keywords || []).slice();
    tags.push(this.tagInput);
    this.tagInput = '';
    this.handleTagChange(tags);
  }

  private handleTagChange = (value: string[]) => {
    const {formObject} = this.props;
    const emotions = value ? flatten(
      value.map((v: string) => {
        return v.split(' ').filter(x => x.length > 0);
      })
    ) : [];

    formObject.setKeywords(emotions);
  };

  private disableDatesAfterLastEntry = (current: Moment) => {
    const {logEntryStore} = this.props;
    return current && current > moment(logEntryStore.lastDates.last).endOf('day');
  };
}
