import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

interface APODResponse {
  copyright: string;
  dateL: string;
  explanation: string;
  media_type: 'video' | 'image';
  title: string;
  url: string;
}

/**
 * Initialization data for the engarcia_js_package_name extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'engarcia_js_package_name:plugin',
  description: 'Test and Dev of JupyterLab extensions.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: async (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension engarcia_js_package_name is activated!!');

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = async () => {
      // Create a blank content widget inside of a MainAreaWidget
      const content = new Widget();
      content.addClass('my-apodWidget');
      const widget = new MainAreaWidget({ content });
      widget.id = 'jlab-engarcia';
      widget.title.label = 'Astronomy Picture';
      widget.title.closable = true;

      // Part 3 of the tutoriakl
      // Add an image to the content
      let img = document.createElement('img');
      content.node.appendChild(img);

      let summary = document.createElement('p');
      content.node.appendChild(summary);

      // Get a random daty
      function randomDate() {
        const start = new Date(2023, 6, 3);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
        return randomDate.toISOString().slice(0,10);
      }

      // Show infor about a random pic
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randomDate()}`);
      if (!response.ok) {
        const data = await response.json();
        if (data.error) {
          summary.innerText = data.error.message;
        } else {
          summary.innerText = response.statusText;
        }
      } else {
        const data = await response.json() as APODResponse;

        if (data.media_type === 'image') {
          // populate the image - this tutorial is just a cp paste ...
          img.src = data.url;
          img.title = data.title;
          summary.innerText = data.title;
          if (data.copyright) {
            summary.innerText += ` (Copyright ${data.copyright})`;
          }
        } else {
          summary.innerText = 'Random APOD fetched was not an image.';
        }

      }
      // const data = await response.json() as APODResponse;

      // if (data.media_type === 'image') {
      //   // Populate the image
      //   img.src = data.url;
      //   img.title = data.title;
      // } else {
      //   console.log('Random APOD was not a picture');
      // }

      return widget;
    }
    let widget = await newWidget();

    // Add an app command
    const command: string = 'apod:open';
    app.commands.addCommand(command, {
      label: 'Random Astronomy Picture',
      execute: async () => {
        //Regenerate the widget if disposed
        if (widget.isDisposed) {
          widget = await newWidget();
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
