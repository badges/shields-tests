'use strict';

const assert = require('assert');
const nock = require('nock');
const nockBackHelpers = require('../../helpers/nock-back-helpers');

describe('Travis', function () {
  let client;
  before(function () { client = global.shields.client; });

  before(nockBackHelpers.before(__dirname));
  after(nockBackHelpers.after());

  before(function () {
    nock('https://api.travis-ci.org')
      // Return a HEAD with no headers.
      .head('/twbs/bootstrap.svg')
      .reply(200)
      // Simulate a connection error.
      .head('/expressjs/express.svg')
      .replyWithError({ code: 'ECONNRESET' });
  });

  it('passing build', function () {
    return client.fetchJson('/travis/rust-lang/rust.json').then(data => {
      assert.deepEqual(data, { name: 'build', value: 'passing' });
    });
  });

  it('erroring build on branch', function () {
    return client.fetchJson('/travis/rust-lang/rust/unstuck.json').then(data => {
      assert.deepEqual(data, { name: 'build', value: 'error' });
    });
  });

  it('unknown branch', function () {
    return client.fetchJson('/travis/rust-lang/rust/non-existant-branch.json').then(data => {
      assert.deepEqual(data, { name: 'build', value: 'not found' });
    });
  });

  it('unknown repo', function () {
    return client.fetchJson('/travis/badges/non-existant-repo.json').then(data => {
      assert.deepEqual(data, { name: 'build', value: 'not found' });
    });
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
