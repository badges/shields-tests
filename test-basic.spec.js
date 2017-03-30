'use strict';

const fs = require('fs');
const url = require('url');
const cheerio = require('cheerio');
const config = require('./config');
const serverHelpers = require('./in-process-server-helpers');
const Client = require('./client');

const getImageSources = htmlSource => {
  const $ = cheerio.load(htmlSource);

  return $('img[src]').map(function () {
    return $(this).attr('src');
  }).toArray();
};

const getServerImages = () => {
  const imageSources = getImageSources(fs.readFileSync(config.tryHtmlPath));
  return imageSources.filter(src => url.parse(src).host === null);
};

describe('Service endpoints in try.html return valid SVG', function () {
  let server, port, baseUri;
  before('Start running the server', function () {
    return serverHelpers.start().then(result => {
      server = result.server;
      port = result.port;
      baseUri = `http://127.0.0.1:${port}`;
    });
  });
  after('Shut down the server', function () { serverHelpers.stop(server); });

  let client;
  before(function () { client = new Client(baseUri); });

  const testSources = getServerImages().filter(src => src !== 'logo.svg');
  // const testSources = getServerImages().filter(src => src !== 'logo.svg').slice(0, 1);

  testSources.forEach(src => {
    it(src, function () {
      this.timeout(5000);
      return client.fetchSvg(src);
    });
  });
});
