'use strict';

const assert = require('assert');
const nockBackHelpers = require('../../helpers/nock-back-helpers');

describe('Travis', function () {
  let client;
  before(function () { client = global.shields.client; });

  before(nockBackHelpers.before(__dirname));
  after(nockBackHelpers.after());

  it('passing build returns expected', function () {
    return client.fetchJson('/travis/rust-lang/rust.json').then(data => {
      assert.deepEqual(data, { name: 'build', value: 'passing' });
    });
  });

  it('branch build returns expected', function () {
    return client.fetchJson('/travis/rust-lang/rust/unstuck.json').then(data => {
      assert.deepEqual(data, { name: 'build', value: 'error' });
    });
  });
});
