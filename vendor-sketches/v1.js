/* eslint-disable */

const ServiceTester = require('../../../lib/testers/service-tester');
const config = require('../../../config');

const t = new ServiceTester(config, 'CRAN', 'cran');
module.exports = t;

t.handles('version', '/v/devtools.json',
  { name: 'cran', value: will.match(/^v\d+\.\d+\.\d+$/) }
);

t.handles('specified license', '/l/devtools.json',
  { name: 'cran', value: 'GPL (>= 2)' }
);

t.handles('unknown package', '/l/some-bogus-package.json',
  { name: 'cran', value: 'not found' }
);

t.handles('unknown info', '/z/devtools.json', {
  status: 404,
  result: { name: 'badge', value: 'not found' }
});

t.handles('malformed response', {
  uri: '/v/foobar.json',
  mock: mock('http://crandb.r-pkg.org')
    .get('/foobar')
    .reply(200)
}, { name: 'cran', value: 'invalid' });

t.handles('connection error', {
  uri: '/v/foobar.json',
  mock: mock('http://crandb.r-pkg.org')
    .get('/foobar')
    .replyWithError({ code: 'ECONNRESET' })
}, { name: 'cran', value: 'inaccessible' });

t.handles('unspecified license', {
  uri: '/v/foobar.json',
  // JSON without License.
  mock: mock('http://crandb.r-pkg.org')
    .get('/foobar')
    .reply(200, {})
}, { name: 'license', value: 'unknown' });
