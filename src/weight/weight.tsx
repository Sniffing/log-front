import React from "react";

import { WeightLineGraph } from ".";
import { inject } from "mobx-react";
import { RootStore } from "../stores/rootStore";

interface IProps {
  rootStore?: RootStore;
}

@inject("rootStore")
export class WeightPage extends React.Component<IProps> {
  render() {
    return (
      <div className="weight-page">
        <WeightLineGraph rootStore={this.props.rootStore} />
      </div>
    );
  }
}
