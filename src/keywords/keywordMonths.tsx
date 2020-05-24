/* eslint-disable no-prototype-builtins */
import React from 'react';
import { observable, keys } from 'mobx';
import ReactMinimalPieChart, {
  PieChartData,
  LabelProps
} from 'react-minimal-pie-chart';
import { clone, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { KeywordEntry } from '../stores/rootStore';

interface IProps {
  data: KeywordEntry[];
}

const baseMonthWordMap: Record<string, Record<string, number>> = {
  '01': {},
  '02': {},
  '03': {},
  '04': {},
  '05': {},
  '06': {},
  '07': {},
  '08': {},
  '09': {},
  '10': {},
  '11': {},
  '12': {}
};

@observer
export class KeywordMonths extends React.Component<IProps> {
  @observable
  private yearMonthData: Record<
    string,
    Record<string, Record<string, number>>
  > = {};

  private convertData(data: KeywordEntry[]) {
    data.forEach(datum => {
      const date = datum.date.split('-');
      const year = date[0];

      if (!this.yearMonthData.hasOwnProperty(year)) {
        this.yearMonthData[year] = clone(baseMonthWordMap);
      }

      const month = date[1];
      datum.keywords.forEach((word: string) => {
        if (!this.yearMonthData[year][month].hasOwnProperty(word)) {
          this.yearMonthData[year][month][word] = 0;
        }
        this.yearMonthData[year][month][word]++;
      });
    });
  }

  public UNSAFE_componentWillReceiveProps(newProps: IProps) {
    if (isEmpty(this.yearMonthData) && !isEmpty(newProps.data)) {
      this.convertData(newProps.data);
    }
  }

  private getJoinedMonthData = () => {
    const data: Record<string, PieChartData[]> = {
      '01': [],
      '02': [],
      '03': [],
      '04': [],
      '05': [],
      '06': [],
      '07': [],
      '08': [],
      '09': [],
      '10': [],
      '11': [],
      '12': []
    };

    keys(this.yearMonthData).forEach((year: any) => {
      keys(this.yearMonthData[year]).forEach((month: any) => {
        keys(this.yearMonthData[year][month]).forEach((word: any) => {
          data[month].push({
            color: '#E38627',
            key: word,
            value: this.yearMonthData[year][month][word]
          });
        });
      });
    });

    return data['10'];
  };

  render() {
    const data: PieChartData[] = this.getJoinedMonthData();

    return (
      <ReactMinimalPieChart
        animate={true}
        animationDuration={500}
        animationEasing="ease-out"
        cx={50}
        cy={50}
        data={data}
        label={(lp: LabelProps) => {
          const d = lp.data[lp.dataIndex];
          return `${d.key as string} [${d.value}]`;
        }}
        labelPosition={50}
        labelStyle={{
          fill: '#121212',
          fontFamily: 'sans-serif',
          fontSize: '5px'
        }}
        lengthAngle={360}
        lineWidth={100}
        radius={50}
        rounded={false}
        startAngle={0}
        style={{
          height: '400px'
        }}
      />
    );
  }
}
