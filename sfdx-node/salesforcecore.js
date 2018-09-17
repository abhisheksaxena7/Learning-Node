// Documentation: https://developer.salesforce.com/media/salesforce-cli/docs/@salesforce/core/0.18.1/index.html

// const {
//   SfdxProject
// } = require('@salesforce/command').core;

const {
  SfdxProject,
} = require('@salesforce/core');

const project = () => SfdxProject.resolve('/Users/appirio-13524/Documents/work-repos/dreamhouse-2gp');
project()
  .then(result => result.retrieveSfdxProjectJson())
  .then(result => {
    const allPluginProperties = result.get('plugins') || {};
    const appirioDX = allPluginProperties.appiriodx;
    appirioDX.schema.description = 'changed desc';
    allPluginProperties.appiriodx = appirioDX;
    result.set('plugins', allPluginProperties);
    result.write();
    console.log(allPluginProperties);
  });
//console.log(`pluginValue: ${project}`);
