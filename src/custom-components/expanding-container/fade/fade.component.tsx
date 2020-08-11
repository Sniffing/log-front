import React from 'react';
import { Transition, TransitionProps } from 'react-spring/renderprops';

interface IProps extends TransitionProps<any> {
  show: boolean;
}

export class Fade extends React.PureComponent<IProps> {
  public render() {
    const {
      show,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      from = { opacity: 0 },
      enter = { opacity: 1 },
      leave = { opacity: 0 },
      ...rest
    } = this.props;


    return (
      <Transition
        {...rest}
        items={show}
        from={from}
        enter={enter}
        leave={leave}>
        {show => _ => show &&  (<div>shit</div>)}
      </Transition>
    );
  }
}