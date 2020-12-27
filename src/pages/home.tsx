import React from 'react';
import { message, Spin } from 'antd';
import { EntryFormModal, IEntryFormModalProps } from '../entry-modal/entry-modal.component';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { LifeEventEntry } from '../entry-modal/event-entry';
import { LifeEventStore } from '../stores/lifeEventStore';
import { CalorieEntry } from '../entry-modal/calorie-entry';
import { CalorieStore } from '../stores/calorieStore';
import { LogEntry, dateFormat, ILogEntry } from '../entry-modal/log-entry';
import { LogEntryStore } from '../stores/logEntryStore';
import moment from 'moment';
import { EntryFormSelector } from '../custom-components/entry-form-select/entry-form-selector.component';
import { EntryOptions, EntryType, IDataVisCard } from './constants';
import { ExpandingContainer } from '../custom-components/expanding-container/expanding-container.component';

import './home.less';
import { KeywordPage } from '../data-vis/keywords';
import { MemoryPage } from '../data-vis/memory';
import { LifeEventsPage } from '../data-vis/life-event';
import CalendarKeyword from '../data-vis/calendar/calendar-keyword';
import { CalendarPage } from '../data-vis/calendar';
import { CalorieFormObject } from '../entry-modal/calorie-entry/CalorieFormObject';
import { CalorieFormErrorObject } from '../entry-modal/calorie-entry/CalorieFormErrorObject';
import { EventFormObject } from '../entry-modal/event-entry/EventFormObject';
import { EventFormErrorObject } from '../entry-modal/event-entry/EventFormErrorObject';
import { LogFormObject } from '../entry-modal/log-entry/LogFormObject';
import { LogFormErrorObject } from '../entry-modal/log-entry/LogFormErrorObject';
import { FULFILLED } from 'mobx-utils';
import { WeightLineGraph } from '../data-vis/weight';

interface IProps {
  lifeEventStore?: LifeEventStore;
  calorieStore?: CalorieStore;
  logEntryStore?: LogEntryStore;
}

@inject('lifeEventStore', 'calorieStore', 'logEntryStore')
@observer
export class Home extends React.Component<IProps> {
  @observable
  private eventFormObject = new EventFormObject();
  @observable
  private eventFormErrorObject = new EventFormErrorObject();

  @observable
  private calorieFormObject = new CalorieFormObject();
  @observable
  private calorieFormErrorObject = new CalorieFormErrorObject();

  @observable
  private logFormObject;
  @observable
  private logFormErrorObject = new LogFormErrorObject();

  @observable
  private selectedForm: EntryType = EntryType.LOG;

  @observable
  private entryModalVisible = false;

  public async componentDidMount(): Promise<void> {
    const {logEntryStore} = this.props;
    await logEntryStore?.fetchLastDates();
    this.logFormObject = new LogFormObject(logEntryStore?.lastDates.last);
  }

  @action.bound
  private createNewLogFormObject(date: string) {
    this.logFormObject = new LogFormObject(date);
  }

  private handleSaveLog = async () => {
    const {logEntryStore} = this.props;
    const entry = this.logFormObject.logEntry;

    this.validateLogObject();

    if (this.logFormErrorObject.hasErrors) {
      return;
    }

    try {
      await logEntryStore.save(entry);
      const nextDate: string = moment(entry.dateState?.date, dateFormat)
        .utc()
        .add(-moment().utcOffset(), 'm')
        .add(1, 'day')
        .format(dateFormat);
      logEntryStore?.setLatestDate(nextDate);
      this.createNewLogFormObject(nextDate);
    } catch (error) {
      message.error(`Error saving data for ${entry.dateState?.date}`);
      console.error(error);
    }
  }

  private validateLogObject = () => {
    this.logFormErrorObject.clear();
    const obj: ILogEntry = this.logFormObject.logEntry;

    this.logFormErrorObject.setError('dateState', obj.dateState?.date ? undefined : 'Mandatory');
    this.logFormErrorObject.setError('textState', obj.textState?.data?.trim() ? undefined : 'Mandatory');
  }

  private handleSaveLifeEvent = async () => {
    const { lifeEventStore } = this.props;

    this.validateEventObject();
    if (this.eventFormErrorObject.hasErrors) {
      return;
    }

    try {
      await lifeEventStore.save(this.eventFormObject.lifeEvent);
    } catch (error) {
      message.error('Error saving event');
      console.error(error);
    }
  }

  private validateEventObject = () => {
    this.eventFormErrorObject.clear();

    const entry = this.eventFormObject.lifeEvent;
    this.eventFormErrorObject.setError('date', entry.date ? undefined : 'Mandatory');
    this.eventFormErrorObject.setError('name', entry.name ? undefined : 'Mandatory');
    this.eventFormErrorObject.setError('intensity', entry.intensity ? undefined : 'Mandatory');
  }

  private handleSaveCalories = async () => {
    const {calorieStore} = this.props;

    this.validateCalorieObject();
    if (this.calorieFormErrorObject.hasErrors) {
      return;
    }

    try {
      if (this.calorieFormObject.calories) {
        await calorieStore?.save(this.calorieFormObject.calorieEntry);
      } else {
        await calorieStore?.saveCaloriesFromCSV(this.calorieFormObject.csvFile);
      }
    } catch (error) {
      message.error('Error saving calories');
      console.error(error);
    }
  }

  private validateCalorieObject = () => {
    this.calorieFormErrorObject.clear();
    const entry = this.calorieFormObject.calorieEntry;
    const csv = this.calorieFormObject.csvFile;

    if (csv || (entry.date && entry.calories)) {
      return;
    }

    this.calorieFormErrorObject.setError('calories', entry.calories ? undefined : 'Mandatory');
    this.calorieFormErrorObject.setError('date', entry.date ? undefined: 'Mandatory');
    this.calorieFormErrorObject.setError('csvFile', csv ? undefined: 'No file uploaded');
  }

  @action
  private handleEntryFormSelect = (entry: EntryType) => {
    this.selectedForm = entry;
    this.setEntryModalVisible(true);
  }

  private get entryFormModalProps(): IEntryFormModalProps {
    const onOk = {
      [EntryType.LOG]:this.handleSaveLog,
      [EntryType.CALORIE]:this.handleSaveCalories,
      [EntryType.EVENT]:this.handleSaveLifeEvent,
    };

    const title = {
      [EntryType.LOG]: 'Log entry',
      [EntryType.CALORIE]:'Calorie entry',
      [EntryType.EVENT]:'Life Event entry',
    };

    return {
      title: title[this.selectedForm],
      keepOpen: this.selectedForm === EntryType.LOG,
      onCancel: () => this.setEntryModalVisible(false),
      onOk: onOk[this.selectedForm],
    };
  }

  @computed
  private get entryFormModalContent(): React.ReactNode {
    const content = {
      [EntryType.LOG]: this.props.logEntryStore?.fetchingDates?.state === FULFILLED ?
        <LogEntry formObject={this.logFormObject} formErrorObject={this.logFormErrorObject}/> :
        <Spin/>,
      [EntryType.CALORIE]: <CalorieEntry formObject={this.calorieFormObject} formErrorObject={this.calorieFormErrorObject}/>,
      [EntryType.EVENT]:  <LifeEventEntry formObject={this.eventFormObject} formErrorObject={this.eventFormErrorObject}/>,
    };

    return content[this.selectedForm] ?? null;
  }

  @computed
  private get analysisCharts(): IDataVisCard[] {
    return [
      {
        key: 0,
        title: 'Feelings',
        component: <KeywordPage/>,
        cover: <div/>,
      },
      {
        key: 1,
        title: 'Feelings Calendar',
        component: <CalendarPage/>,
      },
      {
        key: 2,
        title: 'Events',
        component: <LifeEventsPage/>,
        cover: <div></div>,
      },
      {
        key: 3,
        title: 'Memories',
        component: <MemoryPage/>,
      },
    ];
  }

  public render(): React.ReactNode {
    return (
      <div className="home">
        {/* <EntryFormSelector options={EntryOptions} onSelect={this.handleEntryFormSelect}/>
        <EntryFormModal  visible={this.entryModalVisible} {...this.entryFormModalProps}>
          {this.entryFormModalContent}
        </EntryFormModal> */}

        <div className="mainCard">
          <WeightLineGraph/>
        </div>

        <div className="analysisCards">
          {this.analysisCharts
            // .filter(c => c.key === 0)
            .map(chart => (
              <ExpandingContainer
                bordered={false}
                className="mb-8"
                title={chart.title} key={chart.key}>
                {chart.cover ?? chart.component}
              </ExpandingContainer>
            ))}
        </div>
      </div>
    );
  }

  @action.bound
  private setEntryModalVisible(visible: boolean) {
    this.props.logEntryStore?.fetchLastDates();
    this.entryModalVisible = visible;
  }
}
