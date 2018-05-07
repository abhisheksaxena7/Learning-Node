toposort = require('toposort');

// This time, edges represent dependencies.
var graph = [
    ['tie your shoes', 'put on your shoes'],
    ['put on your jacket', 'put on your shirt'],
    ['put on your shoes', 'put on your shorts'],
    ['put on your jacket', 'put on your shorts']
]

toposort(graph);
// [ 'tie your shoes'
// , 'put on your shoes'
// , 'put on your jacket'
// , 'put on your shirt'
// , 'put on your shorts' ]

// Now, reversing the list will reveal a legal execution order.
toposort(graph).reverse();
// [ 'put on your shorts'
// , 'put on your shirt'
// , 'put on your jacket'
// , 'put on your shoes'
// , 'tie your shoes' ]
