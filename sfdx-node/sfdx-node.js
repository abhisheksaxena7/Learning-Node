var sfdx = require('sfdx-node');
//authorize a dev hub
sfdx.package2.list({
    quiet: false,
    json: false
});