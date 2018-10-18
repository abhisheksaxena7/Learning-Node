var sfdx = require('sfdx-node');
//authorize a dev hub
sfdx.package.install({
    package: '04t6F000003UHtwQAG',
    publishwait: '10',
    wait: '10',
    u: 'DreamHT',
    quiet: false,
    json: false
});
