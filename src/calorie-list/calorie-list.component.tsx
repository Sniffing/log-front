import React from 'react';
import { Timeline, Spin } from 'antd';
import { CalorieStore } from '../stores/calorieStore';
import { inject, observer } from 'mobx-react';
import { PENDING } from 'mobx-utils';
import { ICalorieEntry } from '../entry-modal/calorie-entry';

import './calorie-list.scss';
import { Utils } from '../App.utils';
import { computed } from 'mobx';

interface IProps {
  calorieStore?: CalorieStore;
}

@inject('calorieStore')
@observer
export class CalorieList extends React.Component<IProps> {

  //Good for now, return from back end in future (settings)
  private readonly CALORIE_LIMIT = 2000;

  public componentDidMount() {
    this.props.calorieStore?.fetch();
  }

  @computed
  private get data(): ICalorieEntry[] {
    return this.props.calorieStore?.calorieEntries || [];
  }

  public render() {
    const loading = this.props.calorieStore?.fetchingCalories?.state === PENDING;

    if (loading) {
      return <Spin></Spin>;
    }

    return (
      <Timeline mode="left" reverse className="calorieList">
        {this.data.map(d => (
          <Timeline.Item
            key={d.date}
            color={d.calories > this.CALORIE_LIMIT ? 'red': 'green'}
            label={Utils.unixTimeToDate({time: d.date * 1000, divider:'/'})}
          >
            {d.calories}
          </Timeline.Item>
        ))}
      </Timeline>
    );
  }
}