import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the engarcia_js_package_name extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'engarcia_js_package_name:plugin',
  description: 'Test and Dev of JupyterLab extensions.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension engarcia_js_package_name is activated!');
  }
};

export default plugin;
