#!/usr/bin/env node
 //https: //zaiste.net/posts/modern_node_js_command_line_applications_or_cli_with_yargs/
const open = require('open');

const argv = require('yargs')
    .version()
    .usage('Usage: nodejs-cli-app <command> [options]')
    .command(['init [dir]', 'initialize', 'i'], 'Initialize the directory', require('./lib/init'))
    .example('nodejs-cli-app init my-project', 'Initialize `my-project` directory with `default` engine')
    .example('nodejs-cli-app init my-project --engine turbo', 'Initialize `my-project` directory with `turbo` engine')
    .command(['docs'], 'Go to the documentation at https://zaiste.net', {}, _ => open('https://zaiste.net'))
    .demandCommand(1, 'You need at least one command before moving on')
    .help('h')
    .alias('h', 'help')
    .epilogue('for more information, find the documentation at https://zaiste.net')
    .argv;