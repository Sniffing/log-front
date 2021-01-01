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
import CalendarKeyword from '../data-vis/calendar/calendar-keyword';
import { CalorieFormObject } from '../entry-modal/calorie-entry/CalorieFormObject';
import { CalorieFormErrorObject } from '../entry-modal/calorie-entry/CalorieFormErrorObject';
import { EventFormObject } from '../entry-modal/event-entry/EventFormObject';
import { EventFormErrorObject } from '../entry-modal/event-entry/EventFormErrorObject';
import { LogFormObject } from '../entry-modal/log-entry/LogFormObject';
import { LogFormErrorObject } from '../entry-modal/log-entry/LogFormErrorObject';
import { FULFILLED } from 'mobx-utils';
import GridLayout from 'react-grid-layout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { KeywordTile } from '../data-vis/keywords/keyword-tile/keyword-tile.component';
import { MemoryTile } from '../data-vis/memory/memory-tile/memory-tile.component';
import { LifeEventTile } from '../data-vis/life-event/life-event-tile/life-event-tile.component';
import { WeightTile } from '../data-vis/weight/weight-tile/weight-tile.component';
import { FeelingCalendarTile } from '../data-vis/calendar/feeling-calendar-tile/feeling-calendar-tile.component';

const ResponsiveGridLayout = WidthProvider(Responsive);


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

  public render(): React.ReactNode {
    return (
      <div className="home">
        {/* <EntryFormSelector options={EntryOptions} onSelect={this.handleEntryFormSelect}/>
        <EntryFormModal  visible={this.entryModalVisible} {...this.entryFormModalProps}>
          {this.entryFormModalContent}
        </EntryFormModal> */}

        <ResponsiveGridLayout layouts={this.gridLayout} style={{height: '100%'}} cols={this.gridColumns}>
          <div key="main"><WeightTile/></div>
          <div key="a"><KeywordTile/></div>
          <div key="b"><FeelingCalendarTile/></div>
          <div key="c"><LifeEventTile/></div>
          <div key="d"><MemoryTile/></div>
        </ResponsiveGridLayout>
      </div>
    );
  }

  private layout: GridLayout.Layout[] = [
    {i: 'main', static: true, x:0, y:0, w:4, h:4},
    {i: 'a', static: true, x:4, y:0, w:2, h:2},
    {i:'b', static: true,x:4, y:2, w:2, h:2},
    {i:'c', static: true,x:0, y:4, w:2, h:2},
    {i:'d', static: true,x:2, y:4, w:2, h:2},
  ]

  private gridColumns = {
    lg:6,
    md:6,
    sm:6,
    xs:6,
    xxs:6,
  }

  private gridLayout: GridLayout.Layouts = {
    lg: this.layout,
    md:this.layout,
    sm:this.layout,
    xs:this.layout,
    xxs:this.layout,
  }



  @action.bound
  private setEntryModalVisible(visible: boolean) {
    this.props.logEntryStore?.fetchLastDates();
    this.entryModalVisible = visible;
  }
}
