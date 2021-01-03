import React from 'react';
import { Col, Input, Row, Spin } from 'antd';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { pull } from 'lodash';
import {
  WordCount,
  KeywordList,
  KeywordTreemap,
} from '..';
import { LogEntryStore } from '../../../stores/logEntryStore';

import './keyword-view.less';
import { PENDING } from 'mobx-utils';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@observer
export class KeywordView extends React.Component<IProps> {
  @observable
  private bannedList: string[] = [];

  @observable
  private filterAmount = 5;

  public async componentDidMount(): Promise<void> {
    await this.props.logEntryStore.fetchKeywords();
  }

  @computed
  private get activeWords(): WordCount[] {
    const displayTerms = this.allWords
      .filter(({key, value}) => {
        return !this.bannedList.includes(key) &&
          value > this.filterAmount;
      });

    displayTerms.slice().sort((a, b) => {
      return -(a.value - b.value);
    });

    console.log('display', displayTerms);
    return displayTerms;
  }

  @computed
  private get allWords(): WordCount[] {
    const words = Object.entries(this.props.logEntryStore?.keywordCounts)
      .map(([key, value]) => ({ key, value }));

    words.slice().sort((a, b) => {
      return -(a.value - b.value);
    });

    return words;
  }

  @action
  private toggleInBlackList = (word: string) => {
    if (this.bannedList.includes(word)) {
      pull(this.bannedList, word);
    } else {
      this.bannedList.push(word);
    }
  };

  @action.bound
  private setFilterAmount({target : {value}}) {
    this.filterAmount = value;
  }

  public render(): React.ReactNode {
    const {logEntryStore} = this.props;
    const data = this.props.logEntryStore?.keywords || [];

    if (logEntryStore.fetchingKeywords?.state === PENDING) {
      return <Spin/>;
    }

    return (
      <Row className="keyword">
        <Col className="treemap">
          <KeywordTreemap
            data={this.activeWords}
            minCount={this.filterAmount}
          />
        </Col>
        <Col className="filters">
          <div className="mb-2">Number of days recorded: {data?.length}
          </div>
          <div className="mb-4">
            <span>Filter by min occurrence</span>
            <Input
              type="number"
              value={this.filterAmount}
              onChange={this.setFilterAmount}
            />
          </div>
          <KeywordList
            list={this.allWords}
            updateList={this.toggleInBlackList}
            minCount={this.filterAmount}
          />
        </Col>
      </Row>
    );
  }
}
