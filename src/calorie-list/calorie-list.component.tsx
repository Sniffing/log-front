import React from 'react';
import {  Table } from 'antd';
import { CalorieStore } from '../stores/calorieStore';
import { inject, observer } from 'mobx-react';
import { PENDING } from 'mobx-utils';
import { ICalorieEntry } from '../entry-modal/calorie-entry';

import './calorie-list.scss';
import { Utils } from '../App.utils';
import { flatten } from 'lodash';
import { ColumnsType } from 'antd/lib/table';

interface IProps {
  calorieStore?: CalorieStore;
}

@inject('calorieStore')
@observer
export class CalorieList extends React.Component<IProps> {

  private get data(): ICalorieEntry[] {
    // return this.props.calorieStore?.calorieEntries;
    return flatten([1,2,3,4,5,6,7].map(i => ([
      {
        calories: 1000,
        date: 1596807795
      },
      {
        calories: 1800,
        date: 1596857795
      },
      {
        calories: 1900,
        date: 1596907795
      },
      {
        calories: 2400,
        date: 1596957795
      },
      {
        calories: 3100,
        date: 1597007795
      }
    ])));
  }


  private columns: ColumnsType<ICalorieEntry> = [
    {
      title: 'Date',
      render: (entry: ICalorieEntry) => Utils.unixTimeToDate({time: entry.date * 1000, divider: '/'}),
      width: '60%',
    },
    {
      title: 'Date',
      dataIndex: 'calories',
      fixed: 'right'
    }
  ]

  public render() {
    const loading = this.props.calorieStore?.fetchingCalories?.state === PENDING;

    return (
      <Table
        scroll={{
          y: '94vh'
        }}
        columns={this.columns}
        dataSource={this.data}
        size="small"
        className="calorieList"
        loading={loading}
        pagination={false}
      />
    );
  }
}