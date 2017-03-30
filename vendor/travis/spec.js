'use strict';

const assert = require('assert');
const nockBackHelpers = require('../../helpers/nock-back-helpers');

before(function () {
  // nockBack.setMode('record');
  require('nock').back.setMode('lockdown');
});

describe('Travis', function () {
  let client;
  before(function () { client = global.shields.client; });

  before(nockBackHelpers.before(__dirname));
  after(nockBackHelpers.after());

  it('Returns expected for a passing build', function () {
    return client.fetchJson('/travis/rust-lang/rust.json').then(data => {
      assert.deepEqual(data, { name: 'build', value: 'passing' });
    });
  });
});
