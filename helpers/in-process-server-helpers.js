'use strict';

// Usage:
//
// let server, port, baseUri;
// before('Start running the server', function () {
//   return serverHelpers.start().then(result => {
//     ({ server, port } = result);
//     baseUri = `http://127.0.0.1:${port}`;
//   });
// });
// after('Shut down the server', function () { serverHelpers.stop(server); });
//

const portfinder = require('portfinder');
const pify = require('pify');
const config = require('../config');

/**
 * Start the server. If a port number is not provided, an available port is
 * selected automatically.
 *
 * Note: Because of the way Shields works, you can only call this once per
 * node process. Once you call stop(), the game is over.
 *
 * @param {Number} port number (optional)
 * @return {Promise<Object>} { server: {Object}, port: {Number} }
 */
// Return via promise { server, port }
const start = (port) => {
  const getPort = port ? Promise.resolve(port) : portfinder.getPortPromise();

  return getPort.then(port => {
    // Oy!
    process.argv = ['', '', port, 'localhost'];

    const server = require(config.serverPath);

    return { server, port };
  });
};

/**
 * Stop the server.
 *
 * @param {Object} server instance
 * @return {Promise<null>}
 */
const stop = (server) => {
  if (server && server.close) {
    return pify(server.close.bind(server));
  } else {
    return Promise.resolve();
  }
}

module.exports = {
  start,
  stop
};
