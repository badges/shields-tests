'use strict';

const cproc = require('child_process');
const portfinder = require('portfinder');

/**
 * Start the server. If a port number is not provided, an available port is
 * selected automatically.
 *
 * @param {Number} port number (optional)
 * @return {Promise<Object>} { server: {server instance}, port: {Number} }
 */
// Return via promise { server, port }
const start = (port) => {
  const portPromise = port
    ? Promise.resolve(port)
    : portfinder.getPortPromise();

  return portPromise.then(port => new Promise((resolve, reject) => {
    const server = cproc.spawn('node', ['test-server.js', port]);

    const onData = data => {
      if (data.toString().indexOf('ready') >= 0) {
        server.stdout.removeListener('data', onData);
        resolve({ server, port });
      }
    };

    server.stdout.on('data', onData);
    server.stderr.on('data', data => { console.log('' + data); });
    server.on('error', err => { reject(err); });
  }));
};

const stop = (server) => new Promise((resolve, reject) => {
  server.kill();
  server.on('exit', () => { resolve(); });
});

module.exports = {
  start,
  stop
};
