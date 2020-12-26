import React from 'react';
import { Col, Input, Row, Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { pull } from 'lodash';
import {
  WordCount,
  KeywordList,
  KeywordTreemap,
} from '.';
import { Rejected } from '../../custom-components';
import { LogEntryStore, KeywordEntry } from '../../stores/logEntryStore';

import './keyword.less';
import { PENDING } from 'mobx-utils';

interface IProps {
  logEntryStore?: LogEntryStore;
}

@inject('logEntryStore')
@observer
export class KeywordPage extends React.Component<IProps> {
  @observable
  private bannedList: string[] = [];

  @observable
  private dictionary: Record<string, number> = {};

  @observable
  private filterAmount= 5;

  public async componentDidMount(): Promise<void> {
    await this.props.logEntryStore.fetchKeywords();
  }

  @computed
  private get wordCounts(): Record<string, number> {
    const localDictionary: Record<string, number> = {};

    this.props.logEntryStore?.keywords.forEach((entry: KeywordEntry) => {
      entry.keywords.forEach((word: string) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!localDictionary.hasOwnProperty(word)) {
          localDictionary[word] = 1;
        } else {
          localDictionary[word] += 1;
        }
      });
    });

    return localDictionary;
  }

  @computed
  private get activeWords(): WordCount[] {
    const displayTerms = Object.entries(this.wordCounts)
      .filter(([key, _]) => !this.bannedList.includes(key))
      .filter(([_, value]) => value > this.filterAmount)
      .map(([key, value]) => ({ key, value }));

    displayTerms.slice().sort((a, b) => {
      return -(a.value - b.value);
    });

    return displayTerms;
  }

  @computed
  private get allWords(): WordCount[] {
    const words = Object.entries(this.wordCounts)
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
      <div className="keyword">
        {logEntryStore.fetchingKeywords?.case({
          fulfilled: () => (
            <Row>
              <Col className="treemap">
                <KeywordTreemap data={this.activeWords} minCount={this.filterAmount} />
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
          ),
          rejected: () => <Rejected message={'Error fetching Keywords'}/>,
        })}
      </div>
    );
  }
}
