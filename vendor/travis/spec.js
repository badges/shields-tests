'use strict';

const assert = require('assert');
const nock = require('nock');
const nockBackHelpers = require('../../helpers/nock-back-helpers');

describe('Travis', function () {
  let client;
  before(function () { client = global.shields.client; });

  describe('recorded', function () {
    before(nockBackHelpers.before(__dirname));
    after(nockBackHelpers.after());

    it('passing build', function () {
      return client.fetchJson('/travis/rust-lang/rust.json').then(data => {
        assert.deepEqual(data, { name: 'build', value: 'passing' });
      });
    });

    it('failing build on branch', function () {
      return client.fetchJson('/travis/rust-lang/rust/slice.json').then(data => {
        assert.deepEqual(data, { name: 'build', value: 'failing' });
      });
    });

    it('errored build on branch', function () {
      return client.fetchJson('/travis/rust-lang/rust/unstuck.json').then(data => {
        // TODO An errored build probably should be red or reddish.
        assert.deepEqual(data, { name: 'build', value: 'error' });
      });
    });

    it('unknown branch', function () {
      return client.fetchJson('/travis/rust-lang/rust/non-existant-branch.json').then(data => {
        // TODO seems like 'not found' would be better.
        assert.deepEqual(data, { name: 'build', value: 'unknown' });
      });
    });

    it('unknown repo', function () {
      return client.fetchJson('/travis/badges/non-existant-repo.json').then(data => {
        // TODO seems like 'not found' would be better.
        assert.deepEqual(data, { name: 'build', value: 'unknown' });
      });
    });
  });

  describe('simulated', function () {
    before(function () {
      nock('https://api.travis-ci.org')
        // Return a HEAD with no headers.
        .head('/twbs/bootstrap.svg')
        .reply(200)
        // Connection error.
        .head('/expressjs/express.svg')
        .replyWithError({ code: 'ECONNRESET' });
      nock.enableNetConnect('127.0.0.1');
    });
    after(function () {
      nock.cleanAll();
    });

    it('malformed response', function () {
      return client.fetchJson('/travis/twbs/bootstrap.json').then(data => {
        assert.deepEqual(data, { name: 'build', value: 'invalid' });
      });
    });

    it('connection error', function () {
      return client.fetchJson('/travis/expressjs/express.json').then(data => {
        assert.deepEqual(data, { name: 'build', value: 'invalid' });
      });
    });
  });
});
