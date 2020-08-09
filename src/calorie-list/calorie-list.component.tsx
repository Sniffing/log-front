import React from 'react';
import { List } from 'antd';
import { CalorieStore } from '../stores/calorieStore';
import { inject, observer } from 'mobx-react';
import { PENDING } from 'mobx-utils';
import { ICalorieEntry } from '../entry-modal/calorie-entry';

import './calorie-list.scss';
import { Utils } from '../App.utils';

interface IProps {
  calorieStore?: CalorieStore;
}

@inject('calorieStore')
@observer
export class CalorieList extends React.Component<IProps> {


  private get listHeader() {
    return <div>Header</div>;
  }

  private get data(): ICalorieEntry[] {
    return [
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
    ];
  }

  private renderEntry = (item: ICalorieEntry): React.ReactNode => (
    <List.Item>
      <div className="date">{Utils.unixTimeToDate(item.date * 1000)}</div>
      <div className="calories">{item.calories}</div>
    </List.Item>
  );

  public render() {
    const loading = this.props.calorieStore?.fetchingCalories?.state === PENDING;

    return (
      <List
        size="small"
        itemLayout="horizontal"
        loading={loading}
        bordered
        header={this.listHeader}
        dataSource={this.data}
        renderItem={this.renderEntry}
        className="calorieList"
      />
    );
  }
}