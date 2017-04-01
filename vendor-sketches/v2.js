/* eslint-disable */

const ServiceTester = require('../../../lib/testers/service-tester');
const config = require('../../../config');

const t = new ServiceTester('CRAN', config, '/cran');
module.exports = t;

t.expect('version', '/v/devtools.json')
  .toReturn({ name: 'cran', value: v => v.should.match(/^v\d+\.\d+\.\d+$/) });

t.expect('specified license', '/l/devtools.json')
  .toReturn({ name: 'cran', value: 'GPL (>= 2)' });

t.expect('unknown package', '/l/some-bogus-package.json')
  .toReturn({ name: 'cran', value: 'not found' });

t.expect('unknown info', '/z/devtools.json')
  .toReturn({ name: 'badge', value: 'not found' })
  .withStatus(404);

t.expect('malformed response', '/v/foobar.json')
  .given(nock => nock('http://crandb.r-pkg.org')
    .get('/foobar')
    .reply(200))
  .toReturn({ name: 'cran', value: 'invalid' });

t.expect('connection error', '/v/foobar.json')
  .given(nock => nock('http://crandb.r-pkg.org')
    .get('/foobar')
    .replyWithError({ code: 'ECONNRESET' }))
  .toReturn({ name: 'cran', value: 'inaccessible' });

t.expect('unspecified license', '/v/foobar.json')
  // JSON without License.
  .given(nock => nock('http://crandb.r-pkg.org')
    .get('/foobar')
    .reply(200, {}))
  .toReturn({ name: 'license', value: 'unknown' });
