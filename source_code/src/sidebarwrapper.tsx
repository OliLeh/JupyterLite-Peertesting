import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';
import { ISignal, Signal } from '@lumino/signaling';

// Import the ShoutComponent
import { Sidebar } from './sidebar';
import { INotebookTracker } from '@jupyterlab/notebook';

// ... (other component imports)

export class SideBarWrapperWidget extends ReactWidget {
  private _lastShoutMessage: string = '';
  private _messageShouted = new Signal<SideBarWrapperWidget, { message: string }>(this);
  private _notebookTracker: INotebookTracker;
  

  constructor(noteBookTracker: INotebookTracker) {
    super();
    this.addClass('jp-ReactWidget');
    this._notebookTracker = noteBookTracker;
  }

  get lastShoutMessage(): string {
    return this._lastShoutMessage;
  }

  get messageShouted(): ISignal<SideBarWrapperWidget, { message: string }> {
    return this._messageShouted;
  }

  render(): JSX.Element {
    return (
      <Sidebar _lastShoutMessage={this._lastShoutMessage} _messageShouted={this._messageShouted} _notebookTracker={this._notebookTracker}/>
    );
  }
}
