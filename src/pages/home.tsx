import React from 'react';
import { Card, Row, Col, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { Constants } from '../App.constants';
import { IPageConfig, pageDisplayNames } from './page.constants';
import { EntryFormModal } from '../entry-modal/entry-modal.component';
import { observable, action } from 'mobx';
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

interface IProps {
  lifeEventStore?: LifeEventStore;
  calorieStore?: CalorieStore;
}

@inject('lifeEventStore', 'calorieStore')
@observer
export class Home extends React.Component<IProps> {

  @observable
  private entryModalVisible = true;

  private pages: IPageConfig[];
  private count: number;

  private rows = 4;
  private cols = 3;

  constructor(props: any) {
    super(props);
    this.pages = Constants.pageConfigs;
    this.count = this.pages.length;
  }

  private cards = () => {
    const r = Array.from(new Array(this.rows), (x, i) => i + 1);
    const c = Array.from(new Array(this.cols), (x, i) => i + 1);

    const v = r.map((x, i) => (
      <Row key={`row-${x}`} gutter={16}>
        {c.map((x, j) =>
          this.rowCards(this.pages[i * this.cols + j], 24 / this.cols)
        )}
      </Row>
    ));
    return v;
  };

  private rowCards = (page: IPageConfig, span: number) => {
    if (!page) {
      return <></>;
    }
    return (
      <Col span={span} key={page.page}>
        <Card style={{width:'300px', margin: '20px 0' }}>
          <Link to={page.path.toLowerCase()} style={{width: '100%', height:'100%'}}>
            <h1 style={{ textTransform: 'capitalize'}}>
              {pageDisplayNames[page.page]}
            </h1>
          </Link>
        </Card>
      </Col>
    );
  };

  @action.bound
  private setEntryModalVisible(visible: boolean) {
    this.entryModalVisible = visible;
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

  public render() {
    const lifeEventForm = React.createRef<FormInstance>();
    const calorieEventForm = React.createRef<FormInstance>();
    return (
      <>
        <div style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
          {this.cards()}
        </div>
        <Button onClick={() => this.setEntryModalVisible(true)}>Click</Button>

        {/* <EntryFormModal title="Life Event entry" visible={this.entryModalVisible} onCancel={() => this.setEntryModalVisible(false)} onOk={this.handleSaveLifeEvent} formRef={lifeEventForm}>
          <LifeEventEntry formRef={lifeEventForm}/>
        </EntryFormModal> */}
        <EntryFormModal title="Calorie entry" visible={this.entryModalVisible} onCancel={() => this.setEntryModalVisible(false)} onOk={this.handleSaveCalories} formRef={calorieEventForm}>
          <CalorieEntry formRef={calorieEventForm}/>
        </EntryFormModal>
      </>
    );
  }
}
