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
after('Shut down the server', function (done) {
  server.camp.close(function () { done(); });
});

glob.sync(`${__dirname}/*/spec.js`).forEach(specPath => {
  const tester = require(specPath);
  tester.beforeEach = () => { server.requestCache.clear(); };
  tester.toss();
});
