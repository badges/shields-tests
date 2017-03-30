const assert = require('assert');
const url = require('url');
const fetch = require('node-fetch');
const isSvg = require('is-svg');

class Client {
  constructor (baseUri) {
    Object.assign(this, { baseUri });
  }

  // Fetch a resource and ensure it is valid JSON.
  fetchJson (path) {
    const uri = url.resolve(this.baseUri, path);

    return fetch(uri).then(res => {
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('content-type'), 'application/json');
      return res.json();
    });
  }

  // Fetch a resource and ensure it is valid SVG.
  fetchSvg (path) {
    const uri = url.resolve(this.baseUri, path);

    return fetch(uri).then(res => {
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('content-type'), 'image/svg+xml;charset=utf-8');
      return res.text();
    })
    .then(text => {
      assert(isSvg(text), 'is valid SVG');
      return text;
    });
  }
}
module.exports = Client;
