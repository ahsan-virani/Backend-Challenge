import express from 'express';
import httpStatus from 'http-status';

import config from '../../config/config';
import orderRoutes from './order.route';

const router = express.Router();

router.get('/test', (req, res) =>
  res.send('OK')
);

router.get('/error', (req, res, next) => {
  const customError = { message: 'API errored', status: httpStatus.INTERNAL_SERVER_ERROR };
  next(customError);
});

router.use('/orders', orderRoutes);

export default router;
