// Documentation: https://developer.salesforce.com/media/salesforce-cli/docs/@salesforce/core/0.18.1/index.html

// const {
//   SfdxProject
// } = require('@salesforce/command').core;

const {
  Org,
  SfdxProject,
  SfdxProjectJson
} = require('@salesforce/core');

const test = async () => {
  try {
    const orgObj = await Org.create('DEVHUB');
    console.log(orgObj.getUsername());

    return orgObj;
  } catch (e) {
    // Do nothing
  }
};
// test();

const project = () => SfdxProject.resolve();
project()
  .then(result => result.retrieveSfdxProjectJson())
  .then(result => {
    const allPluginProperties = result.get('plugins') || {};
    const appirioDX = allPluginProperties.appiriodx.packages;
    appirioDX.schema.description = 'changed desc';
    allPluginProperties.appiriodx.packages = appirioDX;
    result.set('plugins', allPluginProperties);
    result.write();
    // console.log(allPluginProperties);
  });


const configFile = async () => {
  const project = await SfdxProjectJson.retrieve();
  // console.log(project.get('plugins'));
  // project.awaitEach((key, value) => {
  //   console.log('key:     ' + key);
  //   console.log('value:   ' + value);
  // })
  const packageDir = project.get('packageDirectories');

  console.log(packageDir.some(obj => obj.path === 'force-app/bl'));
};

configFile();
