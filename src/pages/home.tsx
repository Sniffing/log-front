import React from 'react';
import { message, Spin } from 'antd';
import { EntryFormModal, IEntryFormModalProps } from '../entry-modal/entry-modal.component';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { ILifeEventFormValues, LifeEventEntry } from '../entry-modal/event-entry';
import { LifeEventStore } from '../stores/lifeEventStore';
import { convertFormValuesToLifeEvent } from '../entry-modal/event-entry/life-event.helper';
import { FormInstance } from 'antd/lib/form';
import { Store } from 'antd/lib/form/interface';
import { CalorieEntry, ICalorieEntry } from '../entry-modal/calorie-entry';
import { CalorieStore } from '../stores/calorieStore';
import { LogEntry, dateFormat } from '../entry-modal/log-entry';
import { LogEntryStore } from '../stores/logEntryStore';
import moment from 'moment';
import { LogEntryFormStore } from '../stores/logEntryFormStore';
import { EntryFormSelector } from '../custom-components/entry-form-select/entry-form-selector.component';
import { EntryOptions, EntryType } from './constants';
import { ExpandingContainer } from '../custom-components/expanding-container/expanding-container.component';

import './home.scss';
import { KeywordPage } from '../data-vis/keywords';
import { MemoryPage } from '../data-vis/memory';
import { LifeEventsPage } from '../data-vis/life-event';
import CalendarKeyword from '../data-vis/calendar/calendar-keyword';
import { CalendarPage } from '../data-vis/calendar';
import { CalorieFormObject } from '../entry-modal/calorie-entry/CalorieFormObject';
import { CalorieFormErrorObject } from '../entry-modal/calorie-entry/CalorieFormErrorObject';

interface IProps {
  lifeEventStore?: LifeEventStore;
  calorieStore?: CalorieStore;
  logEntryStore?: LogEntryStore;
}

@inject('lifeEventStore', 'calorieStore', 'logEntryStore')
@observer
export class Home extends React.Component<IProps> {
  private lifeEventForm = React.createRef<FormInstance>();

  @observable
  private calorieFormObject = new CalorieFormObject();
  @observable
  private calorieFormErrorObject = new CalorieFormErrorObject();

  private logEntryForm = React.createRef<FormInstance>();

  @observable
  private logEntryFormStore: LogEntryFormStore = new LogEntryFormStore();

  @observable
  private entryModalVisible = false;

  public async componentDidMount() {
    const {logEntryStore} = this.props;

    await logEntryStore?.fetchLastDates();

    this.logEntryFormStore = new LogEntryFormStore({
      dateState: {
        date: logEntryStore?.lastDates.last
      },
      keywordsState: {
        keywords:[]
      }
    });
  }

  @action.bound
  private setEntryModalVisible(visible: boolean) {
    this.props.logEntryStore?.fetchLastDates();

    this.entryModalVisible = visible;
  }

  private handleSaveLog = async () => {
    const {logEntryStore} = this.props;
    const entry = this.logEntryFormStore.DTO;

    if (!logEntryStore) {
      return;
    }

    try {
      await logEntryStore.save(entry);
      const nextDate = moment(entry.dateState?.date, dateFormat)
        .utc()
        .add(-moment().utcOffset(), 'm')
        .add(1, 'day')
        .format(dateFormat);
      this.props.logEntryStore?.setLatestDate(nextDate);
      this.logEntryFormStore.clear();
      this.logEntryFormStore.setDate(nextDate);
    } catch (error) {
      message.error(`Error saving data for ${entry.dateState?.date}`);
      console.error(error);
    }
  }

  private handleSaveLifeEvent = async (value: Store | undefined) => {
    if (!value) return;

    const event = convertFormValuesToLifeEvent(value as ILifeEventFormValues);

    try {
      await this.props.lifeEventStore?.save(event);
    } catch (error) {
      message.error('Could not save entry');
      console.error(error);
    }
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

    if (csv || entry.date && entry.calories) {
      return;
    }

    this.calorieFormErrorObject.setError('calories', entry.calories ? undefined : 'Mandatory');
    this.calorieFormErrorObject.setError('date', entry.date ? undefined: 'Mandatory');
    this.calorieFormErrorObject.setError('csvFile', csv ? undefined: 'No file uploaded');
  }

  @observable
  private selectedForm: EntryType = EntryType.LOG;

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

    const formRef = {
      [EntryType.LOG]:this.logEntryForm,
      [EntryType.CALORIE]: this.lifeEventForm,
      [EntryType.EVENT]:this.lifeEventForm,
    };

    const title = {
      [EntryType.LOG]:'Log entry',
      [EntryType.CALORIE]:'Calorie entry',
      [EntryType.EVENT]:'Life Event entry',
    };

    const formFieldStore = {
      [EntryType.LOG]: this.logEntryFormStore,
      [EntryType.CALORIE]: this.logEntryFormStore,
      [EntryType.EVENT]: this.logEntryFormStore,
    };

    return {
      title: title[this.selectedForm],
      keepOpen: this.selectedForm === EntryType.LOG,
      onCancel: () => this.setEntryModalVisible(false),
      onOk: onOk[this.selectedForm],
      formRef: formRef[this.selectedForm],
      formFieldStore: formFieldStore[this.selectedForm],
    };
  }

  @computed
  private get entryFormModalContent() {
    switch(this.selectedForm) {
    case EntryType.LOG:
      return this.props.logEntryStore?.fetchingDates?.case({
        fulfilled:() => <LogEntry formFieldStore={this.logEntryFormStore}/>,
        pending: () => <Spin/>,
        rejected: () =><Spin/>,
      });
    case EntryType.CALORIE:
      return <CalorieEntry formObject={this.calorieFormObject} formErrorObject={this.calorieFormErrorObject}/>;
    case EntryType.EVENT:
      return <LifeEventEntry formRef={this.lifeEventForm}/>;
    default:
      return null;
    }
  }

  @computed
  private get  analysisCharts() {
    return [
      {
        key: 0,
        title: 'Feelings',
        component: <KeywordPage/>,
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
      },
      {
        key: 3,
        title: 'Memories',
        component: <MemoryPage/>,
      },
    ];
  }

  public render() {
    return (
      <div className="home">
        <EntryFormSelector options={EntryOptions} onSelect={this.handleEntryFormSelect}/>
        <EntryFormModal  visible={this.entryModalVisible} {...this.entryFormModalProps}>
          {this.entryFormModalContent}
        </EntryFormModal>

        <div className="mainCard">
          <ExpandingContainer className="content" />
        </div>

        <div className="analysisCards">
          {this.analysisCharts.map(chart => (
            <ExpandingContainer title={chart.title} className="content" key={chart.key}>
              {chart.component}
            </ExpandingContainer>
          ))}
        </div>
      </div>
    );
  }
}
