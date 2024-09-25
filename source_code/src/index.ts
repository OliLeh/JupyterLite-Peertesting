
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker /*, NotebookActions*/ } from '@jupyterlab/notebook';
import { IStatusBar } from '@jupyterlab/statusbar';

import { SideBarWrapperWidget } from './sidebarwrapper';

/**
 * JupyterLab extensions are made up of plugin(s). You can specify some
 * information about your plugin with the properties defined here. This
 * extension exports a single plugin, and lists the IStatusBar from
 * JupyterLab as optional.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/shout-button:plugin',
  description:
    'An extension that adds a button and message to the right toolbar, with optional status bar widget in JupyterLab.',
  autoStart: true,

  requires: [INotebookTracker],
  // The IStatusBar is marked optional here. If it's available, it will
  // be provided to the plugin as an argument to the activate function
  // (shown below), and if not it will be null.
  optional: [IStatusBar],
  // Make sure to list any 'requires' and 'optional' features as arguments
  // to your activate function (activate is always passed an Application,
  // then required arguments, then optional arguments)

  // It is very important to put the notebookTracker after the app and not after the statusBar since somehow then it accesses the statusbar and not the notebook. 3h down the drain.
  activate: (
    app: JupyterFrontEnd,
    notebookTracker: INotebookTracker,
    statusBar: IStatusBar | null
  ) => {
    console.log('JupyterLab extension shout_button_message is activated!');

    // Create a ShoutWidget and add it to the interface in the right sidebar
    const sidebarWidget: SideBarWrapperWidget = new SideBarWrapperWidget(notebookTracker);
    sidebarWidget.id = 'JupyterSideBarWidget'; // Widgets need an id

    app.shell.add(sidebarWidget, 'right', { rank: 1 });

  }
};

export default plugin;
