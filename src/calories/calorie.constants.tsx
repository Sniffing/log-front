import moment, { Moment } from 'moment';
import { CalorieFormFieldsEnum, CalorieFormFieldsConfigs } from '.';
import { Input, DatePicker } from 'antd';
import React from 'react';
import Form from 'antd/lib/form';

export const isDateDisabled = (date: Moment) => {
  const currDate = moment();
  return currDate < date;
};

export const createFormItem = (elem: CalorieFormFieldsEnum) => {
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
};