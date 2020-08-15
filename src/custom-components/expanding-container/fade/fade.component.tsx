import React from 'react';
import { Transition, TransitionProps, animated } from 'react-spring/renderprops';
import { observer } from 'mobx-react';

interface IProps extends Omit<TransitionProps<any>,'items'|'children'> {
  show: boolean;
  children: JSX.Element;
}

@observer
export class Fade extends React.PureComponent<IProps> {
  public render() {
    const {
      children,
      show,
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
        {show => show && (props => <div style={props}>{children}</div>)}
      </Transition>
    );
  }
}