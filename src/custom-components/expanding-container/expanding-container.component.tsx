import React from 'react';
import { Fade } from './fade/fade.component';

interface IProps {

}

export class ExpandingContainer extends React.Component<IProps> {
  public render() {
    return (
      <Fade></Fade>
    );
  }
}