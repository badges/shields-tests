// Run this file with `mocha`.

'use strict';

const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const cheerio = require('cheerio');
const serverHelpers = require('./server-helpers');

const getImageSources = htmlSource => {
  const $ = cheerio.load(htmlSource);

  return $('img[src]').map(function () {
    return $(this).attr('src');
  }).toArray();
}

const getServerImages = () => {
  if (!process.env.SHIELDS_DIR) {
    throw Error('Please set SHIELDS_DIR to the directory where shields is installed');
  }

  const tryHtmlSource = fs.readFileSync(path.join(process.env.SHIELDS_DIR, 'try.html'));

  const allImageSources = getImageSources(tryHtmlSource);

  return allImageSources.filter(src => url.parse(src).host === null);
}

describe('SVG server endpoints mentioned in try.html', function () {
  let server, port, baseUri;
  before('Start running the server', function () {
    return serverHelpers.start().then(result => {
      ({ server, port } = result);
      baseUri = `http://127.0.0.1:${port}`;
    });
  });
  after('Shut down the server', function () { serverHelpers.stop(server); });

  const testSources = getServerImages().filter(src => src !== 'logo.svg');

  testSources.forEach(src => {
    it(src, function (done) {
      this.timeout(5000);

      http.get(baseUri + src, res => {
        let buffer = '';
        res.on('data', chunk => { buffer += '' + chunk; });
        res.on('end', function () {
          assert(buffer.startsWith('<svg'), '<svg');
          done();
        });
      });
    });
  });
});
