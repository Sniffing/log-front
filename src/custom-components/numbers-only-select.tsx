import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface IProps {
  value?: number;
  onChange?: (value?: number) => void;
}

const numbersRegex = /[0-9]*/;

export class NumbersOnlySelect extends React.Component<IProps> {
  private handleSearch = (v: string) => {
    if (this.props.onChange) {
      if (!numbersRegex.test(v)) {
        this.props.onChange(Number(v));
      }
    }
  };

  private handleChange = (value: number) => {
    if (this.props.onChange)
      this.props.onChange(value);
  }

  public render() {
    return (
      <Select optionFilterProp="children" showSearch onSearch={this.handleSearch}
        onChange={this.handleChange}>
        {[1,2,3,4,5,6,7,8,9,10].map(x =>
          <Option key={x} value={x}>{x}</Option>
        )}
      </Select>
    );
  }
}