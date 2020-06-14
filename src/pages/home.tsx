import React from 'react';
import { Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { Constants, IPageConfig, pageDisplayNames } from '../App.constants';

export class Home extends React.Component {
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
        <Link to={page.path} style={{width: '100%', height:'100%'}}>
          <h1 style={{ textTransform: 'capitalize'}}>
            {pageDisplayNames[page.page]}
          </h1>
        </Link>
      </Card>
    </Col>
  );
};

public render() {
  return (
    <>
      <div style={{ width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
        {this.cards()}
      </div>
    </>
  );
}
}
