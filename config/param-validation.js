import Joi from 'joi';

export default {
  all: {
    query: {
      page: Joi.number()
        .min(1),
      limit: Joi.number()
        .min(1),
      min_type: Joi.number(),
      max_type: Joi.number()
    }
  },
  create: {
    body: {
      orderId: Joi.string()
        .required(),
      companyName: Joi.string()
        .required(),
      customerAddress: Joi.string()
        .required(),
      orderedItem: Joi.string()
        .required(),
      orderType: Joi.number()
        .required(),
    }
  },
  update: {
    body: {
      companyName: Joi.string()
        .required(),
    }
  }
};
