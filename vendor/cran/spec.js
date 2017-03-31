'use strict';

const assert = require('assert');
const nock = require('nock');
const nockBackHelpers = require('../../helpers/nock-back-helpers');

describe('CRAN', function () {
  let client;
  before(function () { client = global.shields.client; });

  describe('recorded', function () {
    before(nockBackHelpers.before(__dirname));
    after(nockBackHelpers.after());

    it('version', function () {
      return client.fetchJson('/cran/v/devtools.json').then(data => {
        assert.deepEqual(data, { name: 'cran', value: 'v1.12.0' });
      });
    });

    it('specified license', function () {
      return client.fetchJson('/cran/l/devtools.json').then(data => {
        assert.deepEqual(data, { name: 'license', value: 'GPL (>= 2)' });
      });
    });

    it('unknown package', function () {
      return client.fetchJson('/cran/l/non-existant-pkg.json').then(data => {
        assert.deepEqual(data, { name: 'cran', value: 'not found' });
      });
    });

    it('unknown info', function () {
      return client.fetchJson('/cran/z/devtools.json', 404).then(data => {
        assert.deepEqual(data, { name: '404', value: 'badge not found' });
      });
    });
  });

  describe('simulated', function () {
    before(function () {
      nock('http://crandb.r-pkg.org')
        // Return a HEAD with no headers.
        .get('/one')
        .reply(200)
        // Connection error.
        .get('/two')
        .replyWithError({ code: 'ECONNRESET' })
        // Unspecified license.
        .get('/three')
        .reply(200, {});
      nock.enableNetConnect('127.0.0.1');
    });
    after(function () {
      nock.cleanAll();
    });

    it('malformed response', function () {
      return client.fetchJson('/cran/v/one.json').then(data => {
        assert.deepEqual(data, { name: 'cran', value: 'invalid' });
      });
    });

    it('connection error', function () {
      return client.fetchJson('/cran/v/two.json').then(data => {
        assert.deepEqual(data, { name: 'cran', value: 'inaccessible' });
      });
    });

    it('unspecified license', function () {
      return client.fetchJson('/cran/l/three.json').then(data => {
        assert.deepEqual(data, { name: 'license', value: 'unknown' });
      });
    });

  });
});
