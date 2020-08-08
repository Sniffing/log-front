import React from 'react';

import './entry-form-selector.scss';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

@observer
export class EntryFormSelector extends React.Component {

  @observable
  private optionsVisible = false;

  @action
  private handleMouseEnter = () => {
    this.optionsVisible = true;
  }

  private handleMouseLeave = () => {
    this.optionsVisible = false;
  }

  public render() {
    return (
      <div className="entryFormSelector">
        <div className="mainSelector" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}/>
        {this.optionsVisible && (
          <>
            <div className="firstChoice"/>
            <div className="secondChoice"/>
            <div className="thirdChoice"/>
          </>
        )}
      </div>
    );
  }
}