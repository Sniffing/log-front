import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { WordCount } from '.';
import ReactEcharts from 'echarts-for-react';
import { computed } from 'mobx';

interface IProps {
  data: WordCount[];
  minCount: number;
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
        data: keywords
      }]
    };
  }

  public render() {
    return (
      <ReactEcharts option={this.option}/>
    );
  }
}