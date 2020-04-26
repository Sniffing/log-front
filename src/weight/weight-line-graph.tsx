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
import { DatePicker, message, Card, Slider } from 'antd';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { RootStore } from '../stores/rootStore';
import { PacmanLoader } from 'react-spinners';
import { SliderValue } from 'antd/lib/slider';
import { FormattedWeight, formatResults, sortByDate, WeightDates, convertToGraphData, computeLineOfBestFit, computeLineOfAverage, getTitleLinePoint } from '.';

interface IProps {
rootStore?: RootStore;
}

@inject('rootStore')
@observer
export class WeightLineGraph extends Component<IProps> {
@observable
private data: FormattedWeight[] = [];

@observable
private dates: WeightDates = {
  start: 0, end: 0, earliest: 0,
};

@observable
private currentData: FormattedWeight[] = [];

@observable
private crosshairValues: any[] = [];

@observable
private fitCloseness: number = 4;

public async componentDidMount() {
  if (!this.props.rootStore) {
    return;
  }

  try {
    await this.props.rootStore.fetchWeightData();
    const data = this.props.rootStore.weightData;

    if (!data.length) {
      return;
    }

    const sortedResults = sortByDate(formatResults(data));

    this.setData(sortedResults);
    this.setCurrent(sortedResults);

    this.setDates({
      start: sortedResults[0].date,
      earliest: sortedResults[0].date,
      end: sortedResults[sortedResults.length - 1].date
    });
  } catch (err) {
    message.error('Could not fetch weight data');
  }
}

@action.bound
private setData(data: FormattedWeight[]) {
  this.data = data;
}

@action.bound
private setCurrent(data: FormattedWeight[]) {
  this.data = data;
}

@action.bound
private setDates(dates: WeightDates) {
  this.dates = dates;
}

@computed
private get averageWeight() {
  return this.data.length
    ? this.data.map(d => d.weight).reduce((acc, item) => acc + item) /
this.data.length
    : 0;
}

@action
private changeStartDate = (newStart: any) => {
  if (newStart !== undefined) {
    const newStartUnix = newStart.unix() * 1000;

    const filteredData = this.data.filter(data => {
      return data.date >= newStartUnix && data.date < this.dates.end;
    });

    this.dates.start = newStartUnix;
    this.currentData = filteredData;

    console.log('settin new strt:', this.state);
  }
};

@action
private changeEndDate = (newEnd: any) => {
  if (newEnd !== undefined) {
    const newEndUnix = newEnd.unix() * 1000;
    console.log('setting new end:', this.dates.end);

    const filteredData = this.data.filter(data => {
      return data.date >= this.dates.start && data.date < newEndUnix;
    });

    this.dates.end = newEndUnix;
    this.currentData = filteredData;
  }
};

private isDateDisabled = (date: any): boolean => {
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

render() {
  const pointLine = <LineSeries
    color="red"
    data={convertToGraphData(this.data)}
    onNearestXY={this.updateCrosshairs}
    onSeriesMouseOut={() => this.updateCrosshairs(null)}
  />;

  const averageLine = <LineSeries color="green" data={computeLineOfAverage(this.data, this.averageWeight)} />;

  const trendLine = <LineSeries
    color="blue"
    data={computeLineOfBestFit(this.data, this.fitCloseness)}
  />;

  return this.data && this.data.length ? (
    <>
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
            title: `Average Weight: ${this.averageWeight.toFixed(1)}kg`,
            color: 'green'
          },
          { title: 'Weight', color: 'red' },
          { title: 'Trend Weight', color: 'blue' }
        ]}
      />
    </>
  ) :
    <div
      style={{
        height: '100%',
        width: '100%'
      }}
    >
      <Card className="loading-card">
        <div style={{ marginBottom: '10px' }}>
					Fetching weight data...
        </div>
        <PacmanLoader color={'#1E78AA'} size={30} />
      </Card>
    </div>;
}
}
