// Run this file with `mocha`.

'use strict';

const assert = require('assert');
const nock = require('nock');
const serverHelpers = require('../../helpers/in-process-server-helpers');
const Client = require('../../helpers/client');
const nockBack = nock.back;

describe('Service endpoints', function () {
  let server, port, baseUri;
  before('Start running the server', function () {
    return serverHelpers.start().then(result => {
      server = result.server;
      port = result.port;
      baseUri = `http://127.0.0.1:${port}`;
    });
  });
  after('Shut down the server', function () { serverHelpers.stop(server); });

  let client;
  before(function () { client = new Client(baseUri); });

  before(function () {
    // nockBack.setMode('record');
    nockBack.setMode('lockdown');
  });

  describe('Travis', function () {
    let nockDone;
    before(function () {
      nockBack.fixtures = './vendor/travis';
      nockBack(
        'fixtures.json',
        { afterRecord: scopes => scopes.filter(s => s.scope !== baseUri) },
        function (done) {
          nock.enableNetConnect('127.0.0.1');
          nockDone = done;
        });
    });
    after(function () { if (nockDone) nockDone(); });

    it('Returns expected for a passing build', function () {
      return client.fetchJson('/travis/rust-lang/rust.json').then(data => {
        assert.deepEqual(data, { name: 'build', value: 'passing' });
      });
    });
  });
});
