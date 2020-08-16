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
import {  ICalorieEntryFormValues, CalorieFormFieldsEnum, ICalorieEntry, CalorieEntry } from '../entry-modal/calorie-entry';
import { convertFormValuesToCalorieEntry } from '../entry-modal/calorie-entry';
import { CalorieStore } from '../stores/calorieStore';
import { RcFile } from 'antd/lib/upload';
import { LogEntry, dateFormat } from '../entry-modal/log-entry';
import { LogEntryStore } from '../stores/logEntryStore';
import moment from 'moment';
import { logEntryDefaults } from '../stores/logEntryFormStore';
import { EntryFormSelector } from '../custom-components/entry-form-select/entry-form-selector.component';
import { EntryOptions, EntryType } from './constants';
import { ExpandingContainer } from '../custom-components/expanding-container/expanding-container.component';

import './home.scss';

interface IProps {
  lifeEventStore?: LifeEventStore;
  calorieStore?: CalorieStore;
  logEntryStore?: LogEntryStore;
}

@inject('lifeEventStore', 'calorieStore', 'logEntryStore')
@observer
export class Home extends React.Component<IProps> {
  private lifeEventForm = React.createRef<FormInstance>();
  private calorieEntryForm = React.createRef<FormInstance>();
  private logEntryForm = React.createRef<FormInstance>();

  @observable
  private entryModalVisible = false;

  public constructor(props: IProps) {
    super(props);

    props.logEntryStore?.fetchLastDates();
  }

  @action.bound
  private setEntryModalVisible(visible: boolean) {
    this.props.logEntryStore?.fetchLastDates();

    this.entryModalVisible = visible;
  }

  private handleSaveLog = async () => {
    const {logEntryStore} = this.props;
    const entry = this.latestLogEntry;

    if (!logEntryStore) {
      return;
    }

    try {
      await logEntryStore.saveEntry(entry);
      const nextDate = moment(entry.dateState?.date, dateFormat)
        .utc()
        .add(-moment().utcOffset(), 'm')
        .add(1, 'day')
        .format(dateFormat);
      this.props.logEntryStore?.setLatestDate(nextDate);
    } catch (error) {
      message.error(`Error saving data for ${entry.dateState?.date}`);
      console.error(error);
    }
  }

  private handleSaveLifeEvent = async (value: Store | undefined) => {
    if (!value) return;

    const event = convertFormValuesToLifeEvent(value as ILifeEventFormValues);

    try {
      await this.props.lifeEventStore?.saveLifeEvent(event);
    } catch (error) {
      message.error('Could not save entry');
      console.error(error);
    }
  }

  private handleSaveCalories = (value: Store | undefined) => {
    if (!value) return;

    const formValues = value as ICalorieEntryFormValues;
    if (!formValues[CalorieFormFieldsEnum.CSV]) {
      this.saveCalorieForm(convertFormValuesToCalorieEntry(formValues));
    } else {
      this.uploadCalorieCSVFile(formValues[CalorieFormFieldsEnum.CSV]);
    }
  }

  private saveCalorieForm = async (entry: ICalorieEntry) => {
    try {
      await this.props.calorieStore?.saveCalorieEntry(entry);
    } catch (error) {
      message.error('Could not save entry');
      console.error(error);
    }
  }

  private uploadCalorieCSVFile = async (csv: RcFile) => {
    if (!csv) return;

    try {
      await this.props.calorieStore?.saveCaloriesFromCSV(csv);
    } catch (error) {
      message.error('Could not save CSV');
      console.error(error);
    }
  }

  @computed
  private get latestLogEntry() {
    return {
      ...logEntryDefaults,
      dateState: {
        date: this.props.logEntryStore?.lastDates.last,
      },
    };
  }

  @observable
  private selectedForm: EntryType = EntryType.LOG;

  @action
  private handleEntryFormSelect = (entry: EntryType) => {
    this.selectedForm = entry;
    this.setEntryModalVisible(true);
  }

  @computed
  private get entryFormModalProps(): IEntryFormModalProps {
    const onOk = {
      [EntryType.LOG]:this.handleSaveLog,
      [EntryType.CALORIE]:this.handleSaveCalories,
      [EntryType.EVENT]:this.handleSaveLifeEvent,
    };

    const formRef = {
      [EntryType.LOG]:this.logEntryForm,
      [EntryType.CALORIE]:this.calorieEntryForm,
      [EntryType.EVENT]:this.lifeEventForm,
    };

    const title = {
      [EntryType.LOG]:'Log entry',
      [EntryType.CALORIE]:'Calorie entry',
      [EntryType.EVENT]:'Life Event entry',
    };

    return {
      title: title[this.selectedForm],
      keepOpen: this.selectedForm === EntryType.LOG,
      onCancel: () => this.setEntryModalVisible(false),
      onOk: onOk[this.selectedForm],
      formRef: formRef[this.selectedForm],
    };
  }

  @computed
  private get entryFormModalContent() {
    switch(this.selectedForm) {
    case EntryType.LOG:
      return this.props.logEntryStore?.fetchingDates?.case({
        fulfilled:() => <LogEntry formRef={this.logEntryForm} formObject={this.latestLogEntry}/>,
        pending: () => <Spin/>,
        rejected: () =><Spin/>,
      });
    case EntryType.CALORIE:
      return <CalorieEntry formRef={this.calorieEntryForm}/>;
    case EntryType.EVENT:
      return <LifeEventEntry formRef={this.lifeEventForm}/>;
    default:
      return null;
    }
  }

  public render() {
    return (
      <div className="home">
        {/* <EntryFormSelector options={EntryOptions} onSelect={this.handleEntryFormSelect}/>
        <EntryFormModal  visible={this.entryModalVisible} {...this.entryFormModalProps}>
          {this.entryFormModalContent}
        </EntryFormModal> */}

        <div className="mainCard">
          <div className="content">content main</div>
        </div>

        <div className="analysisCards">
          <div className="content">
            <ExpandingContainer/>
            <ExpandingContainer/>
            <ExpandingContainer/>
          </div>
        </div>
      </div>
    );
  }
}
