import mongoose from 'mongoose';
import util from 'util';
import config from './config/config';
import app from './config/express';

Promise = require('bluebird'); // eslint-disable-line no-global-assign
mongoose.Promise = Promise;

const mongoUri = config.mongo.host;
console.log('config:', config);
console.log('mongoUri', mongoUri);
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1, useMongoClient: true } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// // print mongoose logs in dev env
// if (config.MONGOOSE_DEBUG) {
// 	mongoose.set('debug', (collectionName, method, query, doc) => {
// 		debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
// 	});
// }

app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});

export default app;
