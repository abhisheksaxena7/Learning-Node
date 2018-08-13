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
    const myPluginProperties = result.get('plugins') || {};
    myPluginProperties.schema.description = 'changed desc';
    result.set('plugins', myPluginProperties);
    //result.write();
    console.log(myPluginProperties);
  });
//console.log(`pluginValue: ${project}`);
