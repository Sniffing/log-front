import React, { CSSProperties, HTMLAttributes } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'antd';
import { Transition, animated, interpolate } from 'react-spring/renderprops';
import Item from 'antd/lib/list/Item';

interface IProps {
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

  public render(){
    //Good enough for now, will have to use animated div and calculate
    //view port changes and apply them to either enter or update
    return (
      <div onClick={this.toggle} className={this.props.className}>
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
                <Card title="minimised" style={{
                  ...props,
                  height: '100%'}}>
                    Minimised
                </Card>

              ) :
              ( props =>
                <Card title="expanded"
                  style={{
                    ...props,
                    textAlign: 'center',
                    width: '90%',
                    height: '90%',
                    position: 'absolute',
                    top: '5%',
                    left: '5%',
                    zIndex: 100,
                  }}>
                    Expanded
                </Card>
              )
          )}
        </Transition>
      </div>);
  }
}