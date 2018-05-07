topo_sort = require('topo-sort');
toposort = require('toposort');

var tsort = new topo_sort();
tsort.add('bl', 'schema');
tsort.add('ui', ['schema', 'bl']);
tsort.add('perms', ['schema', 'bl', 'ui']);
//Order using Topo - Sort schema, bl, ui, perms
console.log('Right Order using Topo-Sort ' + tsort.sort().reverse());

var sfdx = [
    ['bl', 'schema'],
    ['ui', 'schema'],
    ['ui', 'bl'],
    ['perms', 'schema'],
    ['perms', 'bl'],
    ['perms', 'ui']
];
//Right Order using Toposort schema,bl,ui,perms
console.log('Right Order using Toposort ' + toposort(sfdx).reverse());

var sfdxMultiArray = [
    ['bl', 'schema'],
    ['ui', 'schema', 'bl'],
    ['perms', 'schema', 'bl', 'ui'],
];
//Wrong order using Toposort schema, perms, ui, bl
console.log('Wrong order using Toposort ' + toposort(sfdxMultiArray).reverse());
