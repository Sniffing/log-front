import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Treemap } from 'recharts';
import { WordCount } from '.';

interface IProps {
  data: WordCount[];
  minCount: number;
}

@observer
export class KeywordTreemap extends Component<IProps> {
  public render() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

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

    console.log('here', this.props.data);

    const data = [
      {
        children: keywords        
      },
    ];

    return (
      <div>
        <Treemap
          width={vw}
          height={vh/3}
          data={data} 
          stroke="#fff"
          fill="#8884d8"
        />
      </div>
    );
  }
}