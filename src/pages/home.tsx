import React from 'react';
import { Button, message, Spin } from 'antd';
import { Constants } from '../App.constants';
import { IPageConfig} from './page.constants';
import { EntryFormModal } from '../entry-modal/entry-modal.component';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { ILifeEventFormValues } from '../entry-modal/event-entry';
import { LifeEventStore } from '../stores/lifeEventStore';
import { convertFormValuesToLifeEvent } from '../entry-modal/event-entry/life-event.helper';
import { FormInstance } from 'antd/lib/form';
import { Store } from 'antd/lib/form/interface';
import { CalorieEntry, ICalorieEntryFormValues, CalorieFormFieldsEnum, ICalorieEntry } from '../entry-modal/calorie-entry';
import { convertFormValuesToCalorieEntry } from '../entry-modal/calorie-entry/calorie.helper';
import { CalorieStore } from '../stores/calorieStore';
import { RcFile } from 'antd/lib/upload';
import { LogEntry, ILogEntry, dateFormat } from '../entry-modal/log-entry';
import { LogEntryStore } from '../stores/logEntryStore';
import moment from 'moment';
import { logEntryDefaults } from '../stores/logEntryFormStore';

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
  private entryModalVisible = true;

  private pages: IPageConfig[];
  private count: number;

  private rows = 4;
  private cols = 3;

  public constructor(props: IProps) {
    super(props);
    this.pages = Constants.pageConfigs;
    this.count = this.pages.length;

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

  public render() {
    return (
      <>
        <Button onClick={() => this.setEntryModalVisible(true)}>Click</Button>

        {/* <EntryFormModal title="Life Event entry" visible={this.entryModalVisible} onCancel={() => this.setEntryModalVisible(false)} onOk={this.handleSaveLifeEvent} formRef={lifeEventForm}>
          <LifeEventEntry formRef={lifeEventForm}/>
        </EntryFormModal> */}
        {/* <EntryFormModal title="Calorie entry" visible={this.entryModalVisible} onCancel={() => this.setEntryModalVisible(false)} onOk={this.handleSaveCalories} formRef={calorieEntryForm}>
          <CalorieEntry formRef={calorieEntryForm}/>
        </EntryFormModal> */}
        <EntryFormModal title="Log entry" visible={this.entryModalVisible} keepOpen onCancel={() => this.setEntryModalVisible(false)} onOk={this.handleSaveLog} formRef={this.logEntryForm}>
          {this.props.logEntryStore?.fetchingDates?.case({
            fulfilled:() => <LogEntry formRef={this.logEntryForm} formObject={this.latestLogEntry}/>,
            pending: () => <Spin/>,
            rejected: () =><Spin/>,
          })}
        </EntryFormModal>
      </>
    );
  }
}
