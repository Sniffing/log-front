import React from 'react';
import { Row, Col } from 'antd';
import { observable, computed } from 'mobx';
import { chunk } from 'lodash';
import { observer } from 'mobx-react';
import { KeywordTag } from '.';
import { WordCount } from './keyword.interfaces';

interface IProps {
  list: WordCount[];
  updateList: (arg: string) => void;
  minCount: number;
}

@observer
export class KeywordList extends React.Component<IProps> {
  @observable
  private checkMap: Record<string, boolean> = {};

  @computed
  private get filteredList() {
    const {list} = this.props;
    if (!list?.length) return [];

    return list.filter(item => item.value > this.props.minCount);
  }

  private toggleCheck = (item: string) => {
    this.checkMap[item] = !this.checkMap[item];
    this.props.updateList(item);
  };

  public render(): React.ReactNode {
    const columns = 2;
    const lists = chunk(this.filteredList, this.filteredList.length / columns);
    const hasRemainder = lists.length % columns !== 0;
    const columnWidth = Math.floor(24 / (columns + (hasRemainder ? 1 : 0)));

    return (
      <Row gutter={16}>
        {lists.map((list: WordCount[], index: number) => (
          <Col key={`kw-col-${index}`} span={columnWidth}>
            {(list || []).map((item: WordCount, i: number) => {
              return (
                <Row key={`kw-col${index}-row${i}`} className="mb-2">
                  <KeywordTag onChange={() => this.toggleCheck(item.key)}>
                    {item.key} - {item.value}
                  </KeywordTag>
                </Row>
              );
            })}
          </Col>
        ))}
      </Row>
    );
  }
}
