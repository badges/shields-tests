'use strict';

const config = require('../config');

require(config.serverPath);

process.on('SIGTERM', () => { process.exit(0); });
console.log('ready');
