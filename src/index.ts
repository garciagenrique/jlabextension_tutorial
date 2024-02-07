import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

/**
 * Initialization data for the engarcia_js_package_name extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'engarcia_js_package_name:plugin',
  description: 'Test and Dev of JupyterLab extensions.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension engarcia_js_package_name is activated!!');

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = () => {
      // Create a blank content widget inside of a MainAreaWidget
      const content = new Widget();
      const widget = new MainAreaWidget({ content });
      widget.id = 'jlab-engarcia';
      widget.title.label = 'Astronomy Picture';
      widget.title.closable = true;
      return widget;
    }
    let widget = newWidget();

    // Add an app command
    const command: string = 'apod:open';
    app.commands.addCommand(command, {
      label: 'Random Astronomy Picture',
      execute: () => {
        //Regenerate the wodget if disposed
        if (widget.isDisposed) {
          widget = newWidget();
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work 
          // area if it's not there
          app.shell.add(widget, 'main');
        }  
        // Activate teh widget
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette.
    //console.log('IcommandPalette', palette);
    palette.addItem({ command, category: 'Tutorial'});
  }
};

export default plugin;
