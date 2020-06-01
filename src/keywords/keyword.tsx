import React from 'react';
import { Spin } from 'antd';
import { RootStore, KeywordEntry } from '../stores/rootStore';
import { inject, observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import NumericInput from '../custom-components/numericInput';
import { pull } from 'lodash';
import {
  WordCount,
  KeywordList,
  KeywordTreemap,
} from './';
import { Rejected } from '../custom-components';

interface IProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
export class KeywordPage extends React.Component<IProps> {
  @observable
  private bannedList: string[] = [];

  @observable
  private dictionary: Record<string, number> = {};

  @observable
  private filterAmount= 5;

  public async componentDidMount() {
    this.props.rootStore?.fetchKeywords();
  }

  @computed
  private get wordCounts(): Record<string, number> {
    const localDictionary: Record<string, number> = {};

    this.props.rootStore?.keywords.forEach((entry: KeywordEntry) => {
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
    console.log(this.filterAmount);
    console.log(this.wordCounts);

    const displayTerms = Object.entries(this.wordCounts)
      .filter(entry => !this.bannedList.includes(entry[0]))
      .filter(entry => entry[1] > this.filterAmount)
      .map(entry => ({ key: entry[0], value: entry[1] }));

    displayTerms.sort((a, b) => {
      return -(a.value - b.value);
    });

    return displayTerms;
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
  private setFilterAmount(value: string) {
    this.filterAmount = Number(value) || 0;
  }

  public render() {
    const data = this.props.rootStore?.keywords || [];
    return (
      <div className="keyword-page">
        {this.props.rootStore?.fetchingKeywords?.case({
          fulfilled: () => <>
            <h2>Number of days recorded: {data?.length} </h2>
            <KeywordTreemap data={this.activeWords} minCount={this.filterAmount} />
            <NumericInput value={this.filterAmount} onChange={this.setFilterAmount} />
            <KeywordList
              list={this.activeWords}
              updateList={this.toggleInBlackList}
              minCount={this.filterAmount}
            />
          </>,
          pending: () => <Spin/>,
          rejected: () => <Rejected message={'Error fetching Keywords'}/>,
        })}
      </div>
    );
  }
}
