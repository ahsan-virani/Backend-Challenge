import mongoose from 'mongoose';

import Order from './server/models/order.model';
import config from './config/config';
import { clearCache } from './server/cache';

console.log(config.mongo.host);
console.log(config.redis.host);

mongoose.connect(config.mongo.host, { server: { socketOptions: { keepAlive: 1, useMongoClient: true } } });
mongoose.Promise = require('bluebird');

var allProms = [];

// allProms.push(Order.remove({}));
allProms.push(clearCache());

Order.remove({})
  .then(() => {
    for (var i = 0; i < 1000; i++) {
      const order = new Order({
        orderId: i + 1,
        companyName: 'company' + (i % 5),
        customerAddress: 'address' + (i % 5),
        orderedItem: 'item' + (i % 5),
        orderType: (i % 25)
      });
      allProms.push(order.save());
    }

    Promise.all(allProms)
      .then(done => {
        console.log('Seed completed');
        mongoose.connection.close();
        process.exit();
      })
      .catch(err => {
        console.error('Seed failed');
        console.error(err.message);
        console.log(err);
      });
  });
