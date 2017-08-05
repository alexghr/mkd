const signalhubServer = require('signalhub/server');
const bunyan = require('bunyan');
const config = require('./config');

const log = bunyan.createLogger({name: 'mkd'});

const server = signalhubServer({
  origin: config.origin
});

server.on('subscribe', (channel) => {
  log.info({ channel, type: 'sub' }, 'New subscription on %s', channel);
});

server.on('broadcast', (channel) => {
  log.info({ channel, type: 'pub' }, 'Broadcast on %s', channel);
});

server.listen(config.port, () => {
  log.info('MKD signal server listening on %s', config.port);
});
