// Usage:
//
// before(nockBackHelpers.before(__dirname));
// after(nockBackHelpers.after);

const nock = require('nock');
const nockBack = nock.back;

// These are thunks for simpler usage.
const before = function (dirname) {
  const context = this;

  return () => new Promise((resolve, reject) => {
    const baseUri = global.shields.baseUri;

    nockBack.fixtures = dirname;
    nockBack(
      'fixtures.json',
      { afterRecord: scopes => scopes.filter(s => s.scope !== baseUri) },
      nockDone => {
        context.nockDone = nockDone;
        nock.enableNetConnect('127.0.0.1');
        resolve();
      });
  });
};

const after = function () {
  const context = this;

  return () => {
    context.nockDone();
  };
};

module.exports = {
  before,
  after
};
