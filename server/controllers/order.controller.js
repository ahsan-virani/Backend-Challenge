import Order from '../models/order.model';
import utils from '../helpers/utils';

import { redisClient, clearCache } from '../cache';

module.exports = {
  load(req, res, next, id) {
    Order.getByOrderId(id)
      .then((order) => {
        req.order = order;
        return next();
      })
      .catch(e => next(e));
  },

  get(req, res) {
    res.json(req.order);
  },

  update(req, res, next) {
    req.order.update(req.body.companyName)
      .then(order => res.json(order))
      .catch(err => next(err));
  },

  create(req, res, next) {
    const order = new Order({
      orderId: req.body.orderId,
      companyName: req.body.companyName,
      customerAddress: req.body.customerAddress,
      orderedItem: req.body.orderedItem,
      orderType: req.body.orderType
    });
    order.save()
      .then(savedOrder => {
        clearCache();
        res.json(savedOrder);
      })
      .catch(err => next(err));
  },

  delete(req, res, next) {
    req.order.remove()
      .then(deletedOrder => {
        res.json(deletedOrder);
      })
      .catch(e => next(e));
  },

  getAllOrders(req, res, next) {
    Order.page(req._filters.pageNum, req._filters.limit, { $gte: req._filters.minType, $lte: req._filters.maxType })
      .then(orders => {
        console.log('caching data');
        redisClient.setex(req._cacheKey, 60, JSON.stringify(orders));
        console.log('sending DB data');
        res.json(orders);
      })
      .catch(e => next(e));
  }
}
