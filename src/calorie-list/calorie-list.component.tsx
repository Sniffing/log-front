import React from 'react';
import { Timeline } from 'antd';
import { CalorieStore } from '../stores/calorieStore';
import { inject, observer } from 'mobx-react';
import { PENDING } from 'mobx-utils';
import { ICalorieEntry } from '../entry-modal/calorie-entry';

import './calorie-list.scss';
import { Utils } from '../App.utils';
import { flatten } from 'lodash';
import { computed } from 'mobx';

interface IProps {
  calorieStore?: CalorieStore;
}

@inject('calorieStore')
@observer
export class CalorieList extends React.Component<IProps> {

  //Good for now, return from back end in future (settings)
  private readonly CALORIE_LIMIT = 2000;

  @computed
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
    ])))
      .sort((a,b) => a.date - b.date);
  }

  public render() {
    const loading = this.props.calorieStore?.fetchingCalories?.state === PENDING;

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