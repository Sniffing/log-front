import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { WordCount } from '..';
import { computed } from 'mobx';
import { ReactEcharts } from '../../../custom-components/ReactEcharts';
import { LogEntryStore } from '../../../stores/logEntryStore';

import './keyword-treemap.less';
interface IProps {
  data: WordCount[];
  minCount: number;
  logEntryStore?: LogEntryStore;
}

@observer
export class KeywordTreemap extends Component<IProps> {

  @computed
  private get option() {

    const keywords = Array.isArray(this.props.data)
      ? this.props.data.filter(({value}: WordCount) => {
        return value > this.props.minCount;
      }).map(({ key, value }) => {
        return {
          name: `${key} (${value})`,
          value: value,
        };
      })
      : [];

    return {
      series: [{
        type: 'treemap',
        data: keywords,
        nodeClick: false,
        width: '100%',
        height: '100%',
        roam: false,
        silent: true,
        breadcrumb: {
          show: false,
        }
      }]
    };
  }

  public render(): React.ReactNode {
    return (
      <ReactEcharts className="treeMap" option={this.option}/>
    );
  }
}