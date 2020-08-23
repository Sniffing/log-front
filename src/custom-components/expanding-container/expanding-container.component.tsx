import React, { CSSProperties, HTMLAttributes } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'antd';
import { Transition, animated, interpolate } from 'react-spring/renderprops';
import { CardProps } from 'antd/lib/card';
import { CloseCircleOutlined } from '@ant-design/icons';

interface IProps extends CardProps {
  temp?: string;
}

@observer
export class ExpandingContainer extends React.Component<IProps & HTMLAttributes<HTMLDivElement>> {

  @observable
  private expanded = false;

  @action.bound
  private toggle() {
    console.log('toggle');
    this.expanded = !this.expanded;
  }

  private update = (item: any) => {
    // console.log(item);
    return item;
  }

  public render() {
    const { temp, children, ...cardProps } = this.props;

    //Good enough for now, will have to use animated div and calculate
    //view port changes and apply them to either enter or update
    return (
      <div className={this.props.className}>
        <Transition
          from={{ opacity: 0 } as CSSProperties}
          enter={{ opacity: 1,}}
          leave={{ opacity: 0, }}
          update={this.update}
          delay={100}
          items={this.expanded}>
          {show => (
            !show ?
              (props =>
                <Card style={{
                  ...props}}
                hoverable
                onClick={this.toggle}
                >
                  <div style={{height: '90%'}}>Graph goes here</div>
                  <span>{cardProps.title}</span>
                </Card>

              ) :
              ( props =>
                <Card
                  title={<div>
                    <span style={{width: '99%'}}>{this.props.title}</span>
                    <CloseCircleOutlined style={{float:'right'}} onClick={this.toggle}/>
                  </div>}
                  style={{
                    ...props,
                    margin: 0,
                    padding: 0,
                    textAlign: 'center',
                    width: '90%',
                    height: '90%',
                    position: 'absolute',
                    top: '5%',
                    left: '5%',
                    zIndex: 100,
                  }}>
                  <div>{children}</div>
                </Card>
              )
          )}
        </Transition>
      </div>);
  }
}