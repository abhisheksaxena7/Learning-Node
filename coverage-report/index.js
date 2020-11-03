const fs = require('fs');

// MDReport-1.json constructed from
// https://mdcoverage.secure.force.com/services/apexrest/report?version=50
const rawDataFromMDCovReport = fs.readFileSync('MDReport-1.json');
const parsedMDCovData = JSON.parse(rawDataFromMDCovReport);

const metadataSupportedByMDAPI = Object.keys(parsedMDCovData.types)
  .filter(key => parsedMDCovData.types[key].channels.metadataApi === true)
  .sort((a, b) => a.localeCompare(b));
// console.log(metadataSupportedByMDAPI);

const rawDataFromADXV49 = fs.readFileSync('MD-ADX.json');
const parsedADX49 = JSON.parse(rawDataFromADXV49);

const metadataTypesInADX49 = Object.keys(parsedADX49)
  .map(element => parsedADX49[element].xmlName)
  .sort((a, b) => a.localeCompare(b));
// console.log(metadataTypesInADX49);

// const intersection = metadataSupportedByMDAPI.filter(x => metadataTypesInADX49.includes(x));
// const difference = intersection.filter(x => !metadataTypesInADX49.includes(x));
// if difference = [] that means all MDReport-1.json is superset of MD-ADX.json
// console.log(difference);

const difference = metadataSupportedByMDAPI.filter(x => !metadataTypesInADX49.includes(x));
console.log(difference);
fs.writeFileSync('difference.text', difference);
