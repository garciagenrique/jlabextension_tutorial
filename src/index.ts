import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { 
  ICommandPalette, 
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';

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

class APODWidget extends Widget{
  /**
   *  Refacgtoring the APOD widget
   */
  constructor() {
    super();

    this.addClass('engarcia-apodWidget');

    // Add an image elemento to the panel
    this.img = document.createElement('img');
    this.node.appendChild(this.img);

    // Add a summary element to the panel
    this.summary = document.createElement('p');
    this.node.appendChild(this.summary);
  }

  /**
   * The image elemento associated with the widget
   */
  readonly img: HTMLImageElement;

  /**
   * The summary text element associated with the widget
   */
  readonly summary: HTMLParagraphElement;

  /**
   * Handle update requests for the widget.
   */
  async updateAPODImage(): Promise<void> {

    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${this.randomDate()}`);

    if (!response.ok) {
      const data = await response.json();
      if (data.error) {
        this.summary.innerText = data.error.message;
      } else {
        this.summary.innerText = response.statusText;
      }
      return;
    }

    const data = await response.json() as APODResponse;

    if (data.media_type === 'image') {
      // populate the image - this tutorial is just a cp paste ...
      this.img.src = data.url;
      this.img.title = data.title;
      this.summary.innerText = data.title;
      if (data.copyright) {
        this.summary.innerText += ` (Copyright ${data.copyright})`;
      }
    } else {
      this.summary.innerText = 'Random APOD fetched was not an image.';
    }
  }

  /**
  *  And ge the randome data string in the YYY-MM-DD format
  */
  randomDate(): string {
    const start = new Date(2010, 6, 3);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
    return randomDate.toISOString().slice(0,10);
   }
}

/**
 * Activate the APOD widhget extension.
 */
function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer | null) {
  console.log('JupyterLab extension engarcia_js_package_name is activated!!*!');

  // Declare a widget variable
  let widget: MainAreaWidget<APODWidget>;
  
  // // Define (again) a widget creator function
  // const newWidget = () => {
  //   const content = new APODWidget();
  //   const widget = new MainAreaWidget({content});
  //   widget.id = 'jlab-engarcia';
  //   widget.title.label = 'Astronomy Picture';
  //   widget.title.closable = true;
  //   return widget;
  // }

  // // Create a single widget
  // let widget = newWidget();

  // Add an app command
  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Random Astronomy Picture',
    execute: () => {
      //Regenerate the widget if disposed
      if (!widget || widget.isDisposed) {
        const content = new APODWidget();
        widget = new MainAreaWidget({content});
        widget.id = 'engarcia-jupyterlab';
        widget.title.label = 'Astronomy Picture';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }  
      // Refresh the picture in the widget
      widget.content.updateAPODImage();
      
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette
  palette.addItem({ command, category: 'Tutorial'});

  // Track and restory dhe widgets state
  let tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
    namespace: 'apod'
  });
  if (restorer){
    restorer.restore(tracker, {
      command,
      name: () => 'apod'      
    });
  }
}
  /**
  * Initialization data for the jupyterlab_apod extension.
  */
  const plugin: JupyterFrontEndPlugin<void> = {
    id: 'engarcia_js_package_name',
    description: 'Test and Dev of JupyterLab extensions.',
    autoStart: true,
    requires: [ICommandPalette],
    optional: [ILayoutRestorer],
    activate: activate
  };

export default plugin;
