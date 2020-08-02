import * as React from 'react';
import { inject, observer } from 'mobx-react';
import {
  entryFormFields,
  EntryFormFieldsConfigs,
  EntryFormFieldsEnum,
  dateFormat,
  ILogEntry
} from '.';
import {
  Form,
  DatePicker,
  Input,
} from 'antd';
import moment, { Moment } from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import TagsInput from 'react-tagsinput';
import { FormInstance, Rule } from 'antd/lib/form';
import { action} from 'mobx';

import 'react-tagsinput/react-tagsinput.css';
import { flatten, isEqual } from 'lodash';
import { IFormProps } from '../../App.interfaces';
import { LogEntryStore } from '../../stores/logEntryStore';
import { RefObject } from 'react';
import { LogEntryFormStore } from '../../stores/logEntryFormStore';

interface IProps {
  logEntryStore?: LogEntryStore;
  readonly formObject: ILogEntry;
  formRef: RefObject<FormInstance>;
}

@inject('logEntryStore')
@observer
export class LogEntry extends React.Component<IProps> {

  private formObjectStore!: LogEntryFormStore;

  public async componentDidMount() {
    await this.props.logEntryStore?.fetchingDates;
    this.createObjectStore();
  }

  public componentDidUpdate(prevProps: IProps) {
    if (!isEqual(prevProps.formObject.dateState, this.props.formObject.dateState)) {
      this.props.formRef.current?.setFieldsValue({
        [EntryFormFieldsEnum.DATE]: moment(this.props.formObject.dateState?.date, dateFormat),
        [EntryFormFieldsEnum.FREE_EMOTIONS]: [],
        [EntryFormFieldsEnum.THOUGHTS]: undefined,
        [EntryFormFieldsEnum.WEIGHT]: undefined,
      });
    }
  }

  @action.bound
  private createObjectStore() {
    this.formObjectStore = new LogEntryFormStore(this.props.formObject);
  }

  private cleanFormValues() {
    return {
      [EntryFormFieldsEnum.DATE]: moment(this.props.formObject.dateState?.date, dateFormat),
      [EntryFormFieldsEnum.FREE_EMOTIONS]: [],
      [EntryFormFieldsEnum.THOUGHTS]: undefined,
      [EntryFormFieldsEnum.WEIGHT]: undefined,
    };
  }

  private handleDateChange = (value: Moment | null) => {
    if (value) {
      this.formObjectStore.setDate(value.format(dateFormat));
    }
  };

  private handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cryAndThenKeto = event.target?.value;
    this.formObjectStore.setWeight(cryAndThenKeto);
  };

  private handleTagChange = (value: string[]) => {
    const emotions = value ? flatten(
      value.map((v: string) => {
        return v.split(' ').filter(x => x.length > 0);
      })
    ) : [];

    this.formObjectStore.setKeywords(emotions);
  };

  private handleThoughtsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target?.value;
    this.formObjectStore.setThoughts(text);
  };

  private disableDatesAfterLastEntry = (current: Moment) => {
    return current && current > moment(this.props.logEntryStore?.lastDates.last).endOf('day');
  };

  private getFormField = (field: EntryFormFieldsEnum) => {
    const config: IFormProps = EntryFormFieldsConfigs[field];
    let component = <Input></Input>;

    switch (field) {
    case EntryFormFieldsEnum.DATE:
      component = (
        <DatePicker
          value={moment(this.props.formObject.dateState?.date, dateFormat)}
          disabledDate={this.disableDatesAfterLastEntry}
          onChange={this.handleDateChange}
        />
      );
      break;
    case EntryFormFieldsEnum.FREE_EMOTIONS:
      component = (
        <TagsInput
          value={this.props.formObject.keywordsState?.keywords || []}
          inputProps={{ placeholder: 'Add another emotion...' }}
          onChange={this.handleTagChange}
        />
      );
      break;
    case EntryFormFieldsEnum.WEIGHT:
      component = <Input
        value={this.props.formObject.entryMetricState?.weight}
        onChange={this.handleWeightChange}
      />;
      break;
    case EntryFormFieldsEnum.THOUGHTS:
      component = <TextArea value={this.props.formObject.textState?.data} maxLength={1500} onChange={this.handleThoughtsChange} rows={6} />;
      break;
    }

    const rules: Rule[] = [];

    if (config.required) {
      rules.push({
        required: true,
        message: 'Mandatory field'
      });
    }

    if (config.validator) {
      rules.push({
        validator: config.validator
      });
    }

    return (
      <Form.Item
        {...config}
        rules={rules}
      >
        {component}
      </Form.Item>
    );
  };

  private getFormFields = (fields: EntryFormFieldsEnum[]) => {
    return fields.map(this.getFormField);
  };

  public render() {
    return (
      <Form
        ref={this.props.formRef}
        labelCol={{ span: 4 }}
        labelAlign="right"
        wrapperCol={{ offset: 1, span: 19 }}
        initialValues={this.cleanFormValues()}
      >
        {this.getFormFields(entryFormFields)}
      </Form>
    );
  }
}
