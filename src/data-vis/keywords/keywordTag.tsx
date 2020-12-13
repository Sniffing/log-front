import React from 'react';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import './keywordTag.scss';

interface IProps {
  onChange?: () => void;
}

@observer
export class KeywordTag extends React.Component<IProps> {
  @observable
  private checked = true;

  @action
  private handleChange = () => {
    this.checked = !this.checked;

    if (this.props.onChange) {
      this.props.onChange();
    }
  };

  public render() {
    return(
      <CheckableTag
        className={this.checked ? 'keywordTagOn' : 'keywordTagOff'}
        {...this.props}
        checked={this.checked}
        onChange={this.handleChange}
      />
    );
  }
}