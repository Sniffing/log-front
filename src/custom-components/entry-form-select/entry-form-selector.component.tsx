import React from 'react';

import './entry-form-selector.scss';

export class EntryFormSelector extends React.Component {

  public render() {
    return (
      <div className="entryFormSelector">
        <div className="mainSelector"/>
        <div className="firstChoice"/>
        <div className="secondChoice"/>
        <div className="thirdChoice"/>
      </div>
    );
  }
}