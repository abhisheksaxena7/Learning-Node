// Documentation: https://developer.salesforce.com/media/salesforce-cli/docs/@salesforce/core/0.18.1/index.html

// const {
//   SfdxProject
// } = require('@salesforce/command').core;

const {
  SfdxProject,
  SfdxProjectJson
} = require('@salesforce/core');

const project = () => SfdxProject.resolve();
project()
  .then(result => result.retrieveSfdxProjectJson())
  .then(result => {
    const allPluginProperties = result.get('plugins') || {};
    const appirioDX = allPluginProperties.appiriodx.packages;
    appirioDX.schema.description = 'changed desc';
    allPluginProperties.appiriodx = appirioDX;
    result.set('plugins', allPluginProperties);
    result.write();
    console.log(allPluginProperties);
  });


const configFile = async () => {
  const project = await SfdxProjectJson.retrieve();
  project.get('plugins');
  console.log(project);
};

project();
configFile();
