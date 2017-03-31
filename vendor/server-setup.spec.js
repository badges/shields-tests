const serverHelpers = require('../helpers/in-process-server-helpers');
const Client = require('../helpers/client');

let server;
before('Start the server', function () {
  this.timeout(5000);

  return serverHelpers.start().then(result => {
    const baseUri = `http://127.0.0.1:${result.port}`;

    // This approach is dirty, but it saves a good bit of boilerplate in the
    // vendor spec files.
    global.shields = {
      client: new Client(baseUri),
      baseUri
    };
  });
});

after('Shut down the server', function () { serverHelpers.stop(server); });
