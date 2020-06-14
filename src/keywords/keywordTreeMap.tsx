import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { WordCount } from '.';
import ReactEcharts from 'echarts-for-react';

interface IProps {
  data: WordCount[];
  minCount: number;
}

@observer
export class KeywordTreemap extends Component<IProps> {
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
      <div>
        <ReactEcharts option={this.option}/>
      </div>
    );
  }
}