import express from 'express';
import httpStatus from 'http-status';
import validate from 'express-validation';

import config from '../../config/config';
import orderCtrl from '../controllers/order.controller';
import paramValidation from '../../config/param-validation';
import { createCacheKeyFromFilters } from '../cache/helper';
import { tryCache } from '../cache';

const router = express.Router();

function queryMod(req, res, next) {
  let pageNum = Number(req.query.page) - 1 || 0,
    limit = Number(req.query.limit) || 0,
    maxType = Number(req.query.max_type) || Number.MAX_SAFE_INTEGER,
    minType = Number(req.query.min_type) || 0;

  const filters = {
    pageNum,
    limit,
    maxType,
    minType
  };
  req._filters = filters;
  req._cacheKey = createCacheKeyFromFilters(req.baseUrl, [pageNum, limit, maxType, minType]);
  next();
}

router.route('/')
  .get(validate(paramValidation.all), queryMod, tryCache, orderCtrl.getAllOrders)
  .post(validate(paramValidation.create), orderCtrl.create);

router.route('/:orderId')
  .get(orderCtrl.get)
  .put(validate(paramValidation.update), orderCtrl.update)
  .delete(orderCtrl.delete);

router.param('orderId', orderCtrl.load);

export default router;
