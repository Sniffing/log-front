import React from 'react';
import { observer, inject } from 'mobx-react';

import { computed, observable, action } from 'mobx';
import { Spin } from 'antd';
import { LogEntryStore } from '../../stores/logEntryStore';
import { CalorieStore } from '../../stores/calorieStore';
import { generateCombinedDataOption, AnalysisGraph } from '.';
import { LifeEventStore } from '../../stores/lifeEventStore';
import { ReactEcharts } from '../../custom-components/ReactEcharts';

interface IProps {
  logEntryStore?: LogEntryStore;
  calorieStore?: CalorieStore;
  lifeEventStore?: LifeEventStore;
}

@inject('logEntryStore', 'calorieStore', 'lifeEventStore')
@observer
export class Analysis extends React.Component<IProps> {

  @observable
  private selectedGraph: AnalysisGraph = AnalysisGraph.COMBINED_LINES;

  public componentDidMount(): void {
    this.props.logEntryStore?.fetchWeightData();
    this.props.calorieStore?.fetch();
    this.props.lifeEventStore?.fetch();
  }

  @computed
  private get combinedGraph(): React.ReactNode {
    return <ReactEcharts option={generateCombinedDataOption(
      {
        weightData: this.props.logEntryStore?.weights,
        calorieData: this.props.calorieStore?.calorieEntries,
        eventData: this.props.lifeEventStore?.lifeEvents,
      }
    )}/>;
  }

  @action.bound
  public handleGraphChange(value: AnalysisGraph): void {
    this.selectedGraph = value as AnalysisGraph;
  }

  @computed
  private get loading(): boolean {
    return this.props.logEntryStore?.fetchingWeight?.state === 'pending' ||
    this.props.calorieStore?.fetchingCalories?.state === 'pending' ||
    this.props.lifeEventStore?.fetchingLifeEvents?.state === 'pending';
  }

  public render(): React.ReactNode {
    return (
      <>
        <div>Analysis page</div>
        {/* <Select defaultValue={AnalysisGraph.COMBINED_LINES} style={{ width: 120 }} onChange={this.handleGraphChange}>
          {AnalysisGraphs.map(graph => (
            <Option key={graph} value={graph}>{graphLabels[graph]}</Option>
          ))}
        </Select> */}
        {this.loading && <Spin/>}
        {!this.loading && this.combinedGraph}
      </>
    );
  }
}