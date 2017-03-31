'use strict';

const assert = require('assert');
const nock = require('nock');
const nockBackHelpers = require('../../helpers/nock-back-helpers');

describe('CTAN', function () {
  let client;
  before(function () { client = global.shields.client; });

  describe('recorded', function () {
    before(nockBackHelpers.before(__dirname));
    after(nockBackHelpers.after());

    it('version', function () {
      return client.fetchJson('/ctan/v/tex.json').then(data => {
        assert.deepEqual(data, { name: 'ctan', value: 'v3.14159265' });
      });
    });

    it('specified licenses', function () {
      return client.fetchJson('/ctan/l/novel.json').then(data => {
        assert.deepEqual(data, { name: 'ctan', value: 'lppl1.3,ofl' });
      });
    });

    it('unspecified license', function () {
      return client.fetchJson('/ctan/l/tex.json').then(data => {
        assert.deepEqual(data, { name: 'ctan', value: 'unknown' });
      });
    });

    it('unknown package', function () {
      return client.fetchJson('/ctan/l/non-existant-pkg.json').then(data => {
        assert.deepEqual(data, { name: 'ctan', value: 'not found' });
      });
    });

    it('unknown info', function () {
      return client.fetchJson('/ctan/z/tex.json', 404).then(data => {
        assert.deepEqual(data, { name: '404', value: 'badge not found' });
      });
    });
  });

  describe('simulated', function () {
    before(function () {
      nock('http://www.ctan.org')
        // Return a HEAD with no headers.
        .get('/json/pkg/reledmac')
        .reply(200)
        // Connection error.
        .get('/json/pkg/libertine')
        .replyWithError({ code: 'ECONNRESET' });
      nock.enableNetConnect('127.0.0.1');
    });
    after(function () {
      nock.cleanAll();
    });

    it('malformed response', function () {
      return client.fetchJson('/ctan/v/reledmac.json').then(data => {
        assert.deepEqual(data, { name: 'ctan', value: 'invalid' });
      });
    });

    it('connection error', function () {
      return client.fetchJson('/ctan/v/libertine.json').then(data => {
        assert.deepEqual(data, { name: 'ctan', value: 'inaccessible' });
      });
    });
  });
});
