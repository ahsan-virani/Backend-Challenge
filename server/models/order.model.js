import mongoose from 'mongoose';
import httpStatus from 'http-status';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  orderedItem: {
    type: String,
    required: true
  },
  orderType: {
    type: Number,
    required: true
  }
});

OrderSchema.statics = {
  getByOrderId(id) {
    return this.findOne({ orderId: id })
      .exec()
      .then(order => {
        if (order)
          return order;
        const err = { status: httpStatus.NOT_FOUND, message: `Order by id ${id} does not exist` };
        return Promise.reject(err);
      });
  },
  page(page, limit, filter) {
    return this.find({ 'orderType': filter })
      .sort({ 'orderId': 1 })
      .skip(page * limit)
      .limit(limit)
      .exec();
  }
}

OrderSchema.methods = {
  update(companyName) {
    this.companyName = companyName;
    return this.save();
  }
}

export default mongoose.model('Order', OrderSchema);
