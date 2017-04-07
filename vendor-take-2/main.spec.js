'use strict';

const glob = require('glob');
const config = require('./config');

let server;
before('Start running the server', function () {
  this.timeout(5000);
  // This is a bit gross, but it works.
  process.argv = ['', '', config.port, 'localhost'];
  server = require('../shields/server');
});
// Needs module.exports = camp; in server.js
// after('Shut down the server', function(done) {
//   server.close(function () { done(); });
// });

glob.sync(`${__dirname}/*/spec.js`).forEach(spec => {
  const tester = require(spec);
  tester.beforeEach = () => { server.requestCache.clear(); };
  tester.toss();
});
