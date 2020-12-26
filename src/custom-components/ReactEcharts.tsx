import React from 'react';
import { EChartOption } from 'echarts';
import EChartsNextForReactCore from 'echarts-next-for-react';

interface IProps {
  option: EChartOption;
}

export class ReactEcharts extends React.Component<IProps> {


  // public constructor(props: IProps) {
  //   super(props);
  //   const {option} = props;
  //   const chart = echarts.init(this.chart.current);
  //   chart.setOption(option);
  // }

  public render(): JSX.Element {
    return (
      <EChartsNextForReactCore option={this.props.option} />
    );
  }
}