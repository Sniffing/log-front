import React from 'react';
import { Fade } from './fade/fade.component';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Card } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Transition } from 'react-spring/renderprops';

interface IProps {
  temp?: string;
}

@observer
export class ExpandingContainer extends React.Component<IProps> {

  @observable
  private expanded = false;

  @observable
  private width = 600;

  @observable
  private height = 600;

  @action.bound
  private toggle() {
    console.log('toggle');
    this.expanded = !this.expanded;
  }

  private update = () => {
    const open = this.expanded;
    return {
      opacity: this.expanded ? 0 : 1,
      width: open ? this.width : 0,
      height: open ? this.height : 0,
    };
  }

  public render() {
    return (
      <div onClick={this.toggle} style={{backgroundColor: 'green', width: '100%', height: '100%'}}>
        <Transition
          native
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
          items={this.expanded}>
          {show => props => !show && (
            <Card title="minimised" style={props}>
                Minimised
            </Card>
          )}
        </Transition>
        <Transition
          native
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
          items={this.expanded}>
          {show => props => show && (
            <Card title="expanded" style={{
              textAlign: 'center',
              width: '90%',
              height: '90%',
              ...props}}>
                Expanded
            </Card>
          )}
        </Transition>
      </div>);
  }

  // public render() {
  //   return (
  //     <div style={{backgroundColor: 'green', height:'100%', width:'300px'}} onClick={this.toggle}>
  //       <Transition
  //         native
  //         items={!this.expanded}
  //         from={{ opacity: 0 }}
  //         leave={{ opacity: 0 }}
  //         enter={this.update}
  //         update={this.update}>
  //         {item => style => (
  //           <Fade
  //             {...style}
  //             delay={this.expanded ? 500 : 0}
  //             show={this.expanded}
  //             from={{ opacity: 0, }}
  //             enter={{ opacity: 1, }}
  //             leave={{ opacity: 0, }}
  //           >
  //             <Card title={<Title level={2}>Expanded card</Title>}>
  //           More content!
  //             </Card>
  //           </Fade>
  //         )}

  //       </Transition>

  //       <Fade
  //         show={!this.expanded}
  //         from={{ opacity: 0 }}
  //         enter={{ opacity: 1 }}
  //         leave={{ opacity: 0 }}
  //       >
  //         <Card title={<Title level={2}>Title</Title>}>
  //           Some content goes in here
  //         </Card>
  //       </Fade>
  //     </div>
  //   );
  // }
}