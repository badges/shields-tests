/* eslint-disable */

const ServiceTester = require('../../../lib/testers/service-tester');
const config = require('../../../config');

const t = new ServiceTester('CRAN', config, '/cran');
module.exports = t;

t.get('version', '/v/devtools.json')
  .expectJSON({ name: 'cran', value: v => v.should.match(/^v\d+\.\d+\.\d+$/) });

t.get('specified license', '/l/devtools.json')
  .expectJSON({ name: 'cran', value: 'GPL (>= 2)' });

t.get('unknown package', '/l/some-bogus-package.json')
  .expectJSON({ name: 'cran', value: 'not found' });

t.get('unknown info', '/z/devtools.json')
  .expectStatus(404)
  .expectJSON({ name: 'badge', value: 'not found' });

t.get('malformed response', '/v/foobar.json')
  .intercept(nock => nock('http://crandb.r-pkg.org')
    .get('/foobar')
    .reply(200))
  .expectJSON({ name: 'cran', value: 'invalid' });

t.get('connection error', '/v/foobar.json')
  .intercept(nock => nock('http://crandb.r-pkg.org')
    .get('/foobar')
    .replyWithError({ code: 'ECONNRESET' }))
  .expectJSON({ name: 'cran', value: 'inaccessible' });

t.get('unspecified license', '/v/foobar.json')
  // JSON without License.
  .intercept(nock => nock('http://crandb.r-pkg.org')
    .get('/foobar')
    .reply(200, {}))
  .expectJSON({ name: 'license', value: 'unknown' });
