import React, { Component } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  LineSeriesPoint,
  VerticalGridLines,
  Crosshair,
  DiscreteColorLegend
} from 'react-vis';
import { DatePicker, Slider, Result, Spin } from 'antd';
import moment, { Moment } from 'moment';
import { observer, inject } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { RootStore } from '../stores/rootStore';
import { SliderValue } from 'antd/lib/slider';
import { FormattedWeight, formatResults, sortByDate, WeightDates, convertToGraphData, computeLineOfBestFit, computeLineOfAverage, getTitleLinePoint, getAverageWeight } from '.';
import { Rejected } from '../custom-components';

interface IProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
export class WeightLineGraph extends Component<IProps> {

@observable
private dates: WeightDates = {
  start: 0, end: 0, earliest: 0,
};

@observable
private crosshairValues: any[] = [];

@observable
private fitCloseness = 4;

public componentDidMount() {
  this.props.rootStore?.fetchWeightData();
}

@computed
private get formattedData(): FormattedWeight[] {
  const sortedResults = sortByDate(formatResults(this.props.rootStore?.weights));

  if (sortedResults.length) {
    this.setDates({
      start: sortedResults[0].date,
      earliest: sortedResults[0].date,
      end: sortedResults[sortedResults.length - 1].date
    });
  }

  return sortedResults;
}

@action.bound
private setDates(dates: WeightDates) {
  this.dates = dates;
}

@action
private changeStartDate = (newStart: any) => {
  if (newStart !== undefined) {
    const newStartUnix = newStart.unix() * 1000;

    // const filteredData = this.formattedData.filter(data => {
    //   return data.date >= newStartUnix && data.date < this.dates.end;
    // });

    this.dates.start = newStartUnix;
  }
};

@action
private changeEndDate = (newEnd: any) => {
  if (newEnd !== undefined) {
    const newEndUnix = newEnd.unix() * 1000;
    console.log('setting new end:', this.dates.end);
 
    // const filteredData = this.formattedData.filter(data => {
    //   return data.date >= this.dates.start && data.date < newEndUnix;
    // });

    this.dates.end = newEndUnix;
  }
};

private isDateDisabled = (date: Moment): boolean => {
  return (date < moment(this.dates.earliest) || date > moment().endOf('day'));
}

@action
private handlePrecisionChange = (value: SliderValue) => {
  this.fitCloseness = typeof value === 'number' ? value : 4;
};

@action.bound
private updateCrosshairs(dataPoint: any) {
  this.crosshairValues = dataPoint ? [dataPoint] : [];
}

private createGraph = (data: FormattedWeight[]) => {
  const averageWeight = this.props.rootStore ? getAverageWeight(this.props.rootStore.weights) : 0;
  const pointLine = <LineSeries
    color="red"
    data={convertToGraphData(data)}
    onNearestXY={this.updateCrosshairs}
    onSeriesMouseOut={() => this.updateCrosshairs(null)}
  />;

  const averageLine = <LineSeries color="green" data={computeLineOfAverage(data, averageWeight)} />;

  const trendLine = <LineSeries
    color="blue"
    data={computeLineOfBestFit(data, this.fitCloseness)}
  />;

  return (
    <>
      <XYPlot xType="time" width={800} height={300}>
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis title="Date" />
        <YAxis title="Weight (kg)" />
        {pointLine}
        {averageLine}
        {trendLine}
        <Crosshair
          values={this.crosshairValues}
          titleFormat={getTitleLinePoint}
          itemsFormat={(d: LineSeriesPoint) => [
            { title: 'Weight', value: d[0].y.toFixed(1) }
          ]}
        />
      </XYPlot>

      <DiscreteColorLegend
        orientation="vertical"
        onItemClick={() => {}}
        items={[
          {
            title: `Average Weight: ${averageWeight.toFixed(1)}kg`,
            color: 'green'
          },
          { title: 'Weight', color: 'red' },
          { title: 'Trend Weight', color: 'blue' }
        ]}
      />
    </>
  );
}


public render() {

  const graph = this.props.rootStore?.fetchingWeight?.case({
    fulfilled: () => this.createGraph(this.formattedData),
    pending: () => <Spin/>,
    rejected: () =>  <Rejected message={'Error fetching Weights'}/>,
  });

  return <>
    <Slider
      min={2}
      max={7}
      range={false}
      onChange={this.handlePrecisionChange}
      value={this.fitCloseness}
    />
    <DatePicker
      disabledDate={this.isDateDisabled}
      onChange={this.changeStartDate}
      format="YYYY-MM-DD"
    />
    <DatePicker
      disabledDate={this.isDateDisabled}
      onChange={this.changeEndDate}
      format="YYYY-MM-DD"
    />
    {graph}
  </>;
}
}
