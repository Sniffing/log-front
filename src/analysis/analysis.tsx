import React from 'react';
import { observer, inject } from 'mobx-react';
import ReactEcharts from 'echarts-for-react';
import { EChartOption } from 'echarts';

import { computed, observable, action } from 'mobx';
import { Spin, Select } from 'antd';
import { LogEntryStore } from '../stores/logEntryStore';
import { CalorieStore } from '../stores/calorieStore';
import { generateCombinedDataOption, ICombinedDataSources, generateInversedGraphOption, AnalysisGraphs, graphLabels, AnalysisGraph } from '.';

const {Option} = Select;

interface IProps {
  logEntryStore?: LogEntryStore;
  calorieStore?: CalorieStore;
}

@inject('logEntryStore', 'calorieStore')
@observer
export class Analysis extends React.Component<IProps> {

  @observable
  private selectedGraph: AnalysisGraph = AnalysisGraph.COMBINED_LINES;

  public componentDidMount() {
    this.props.logEntryStore?.fetchWeightData();
    this.props.calorieStore?.fetchCalorieEntries();
  }

  @computed
  private get option(): EChartOption {
    let transformFn;

    switch(this.selectedGraph) {
    case AnalysisGraph.COMBINED_LINES:
      transformFn = generateCombinedDataOption;
      break;
    case AnalysisGraph.INVERSE_COMPARE:
      transformFn = generateInversedGraphOption;
      break;
    default:
      transformFn = generateCombinedDataOption;
    }

    return this.applyTransformation(transformFn);
  }

  private applyTransformation(optionGenerator: (args: ICombinedDataSources) => EChartOption) {
    return optionGenerator({
      weightData: this.props.logEntryStore?.weights,
      calorieData: this.props.calorieStore?.calorieEntries,
    });
  }

  @action.bound
  public handleGraphChange(value: AnalysisGraph) {
    this.selectedGraph = value;
  }

  @computed
  private get loading() {
    return this.props.logEntryStore?.fetchingWeight?.state === 'pending' ||
    this.props.calorieStore?.fetchingCalories?.state === 'pending';
  }

  public render() {
    return (
      <>
        <div>Analysis page</div>
        <Select defaultValue={AnalysisGraph.COMBINED_LINES} style={{ width: 120 }} onChange={this.handleGraphChange}>
          {AnalysisGraphs.map(graph => (
            <Option key={graph} value={graph}>{graphLabels[graph]}</Option>
          ))}
        </Select>
        {this.loading ? <Spin/> : <ReactEcharts option={this.option}/>}
      </>
    );
  }
}