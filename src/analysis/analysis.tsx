import React from 'react';
import { RootStore } from '../stores/rootStore';
import { observer, inject } from 'mobx-react';
import MetricsGraphics from 'react-metrics-graphics';
import 'metrics-graphics/dist/metricsgraphics.css';

interface IProps {
  rootStore?: RootStore;
}

@inject('rootStore')
@observer
export class Analysis extends React.Component<IProps> {

  public render() {
    return (
      <>
        <div>Analysis page</div>
        <MetricsGraphics
          title="Downloads">

        </MetricsGraphics>
      </>
    );
  }
}