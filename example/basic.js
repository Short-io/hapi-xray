const Hapi = require('hapi');

const debug = require('debug')('hapi-xray');

const server = Hapi.server({
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    const segment = request.segment;
    segment.addAnnotation('hitController', 'true');

    return { hello: 'world' };
  }
});

const start = async () => {
  try {
    await server.register({
      plugin: require('../'),
      options: {
        captureAWS: false
      }
    });
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

start();
