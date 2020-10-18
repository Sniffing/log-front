import * as React from 'react';
import { inject, observer } from 'mobx-react';
import {
  EntryFormFieldsConfigs,
  EntryFormFieldsEnum,
  dateFormat,
} from '.';
import {
  Form,
  DatePicker,
  Input, Tag, Spin
} from 'antd';
import moment, { Moment } from 'moment';
import TextArea from 'antd/lib/input/TextArea';

import { flatten } from 'lodash';
import { LogEntryFormStore } from '../../stores/logEntryFormStore';
import { LogEntryStore } from '../../stores/logEntryStore';
import { action, observable } from 'mobx';

interface IProps {
  logEntryStore?: LogEntryStore;
  formFieldStore: LogEntryFormStore;
}

@inject('logEntryStore')
@observer
export class LogEntry extends React.Component<IProps> {

  @observable
  private tagInput = '';

  public async componentDidMount() {
    const { logEntryStore } = this.props;
    await logEntryStore?.fetchingDates;
  }

  public render() {
    const {DTO} = this.props.formFieldStore;
    const tags = DTO.keywordsState?.keywords ?? [];

    return (
      <Form
        labelCol={{ span: 4 }}
        labelAlign="right"
        wrapperCol={{ offset: 1, span: 19 }}
      >
        <Form.Item {...EntryFormFieldsConfigs[EntryFormFieldsEnum.DATE]}>
          <DatePicker
            value={moment(DTO.dateState?.date, dateFormat)}
            disabledDate={this.disableDatesAfterLastEntry}
            onChange={this.handleDateChange}
          />
        </Form.Item>
        <Form.Item {...EntryFormFieldsConfigs[EntryFormFieldsEnum.FREE_EMOTIONS]}>
          <Input value={this.tagInput} onChange={this.updateTagInput} onPressEnter={this.addTag}/>
          {tags.map(tag => <Tag key={tag} color='blue'>{tag}</Tag>)}
        </Form.Item>
        <Form.Item {...EntryFormFieldsConfigs[EntryFormFieldsEnum.WEIGHT]}>
          <Input
            value={DTO.entryMetricState?.weight}
            onChange={this.handleWeightChange}
          />
        </Form.Item>
        <Form.Item {...EntryFormFieldsConfigs[EntryFormFieldsEnum.THOUGHTS]}>
          <TextArea
            value={DTO.textState?.data}
            maxLength={1500}
            onChange={this.handleThoughtsChange}
            rows={6}
          />
        </Form.Item>
      </Form>
    );
  }

  private handleDateChange = (value: Moment | null) => {
    if (value) {
      this.props.formFieldStore.setDate(value.format(dateFormat));
    }
  };

  private handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cryAndThenKeto = event.target?.value;
    this.props.formFieldStore.setWeight(cryAndThenKeto);
  };

  @action.bound
  private updateTagInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.tagInput = event.target.value;
  }

  @action
  private addTag = () => {
    const tags = (this.props.formFieldStore.DTO.keywordsState?.keywords || []).slice();
    tags.push(this.tagInput);
    this.tagInput = '';
    this.handleTagChange(tags);
  }

  private handleTagChange = (value: string[]) => {
    const emotions = value ? flatten(
      value.map((v: string) => {
        return v.split(' ').filter(x => x.length > 0);
      })
    ) : [];

    this.props.formFieldStore.setKeywords(emotions);
  };

  private handleThoughtsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target?.value;
    console.log('updated');
    this.props.formFieldStore.setThoughts(text);
  };

  private disableDatesAfterLastEntry = (current: Moment) => {
    return current && current > moment(this.props.logEntryStore?.lastDates.last).endOf('day');
  };
}
