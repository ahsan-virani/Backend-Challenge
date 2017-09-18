import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import chai, { expect, assert } from 'chai';

import Order from '../models/order.model';
import config from '../../config/config';
import app from '../../index';
import { clearCache } from '../cache';

chai.config.includeStack = true;

const ordersCount = 50;

describe('## Orders', () => {
  before((done) => {
    var allProms = [];
    // allProms.push(Order.remove({}));
    allProms.push(clearCache());
    Order.remove({})
      .then(() => {
        for (var i = 0; i < ordersCount; i++) {
          const order = new Order({
            orderId: i + 1,
            companyName: 'company' + (i % 5),
            customerAddress: 'address' + (i % 5),
            orderedItem: 'item' + (i % 5),
            orderType: (i % 10)
          });
          allProms.push(order.save());
        }

        Promise.all(allProms)
          .then(() => {
            console.log('Seed completed');
            done();
          })
          .catch(err => {
            console.error('Seed failed');
            console.error(err.message);
            console.log(err);
            throw (err);
          });
      })
  });

  describe('# PUT /api/orders/5', () => {
    it('should update order with id 5', (done) => {
      request(app)
        .put('/api/orders/5')
        .send({ companyName: 'updated company name' })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.orderId)
            .to.equal('5');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/orders', () => {
    it('should return array of orders', (done) => {
      request(app)
        .get('/api/orders')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.lengthOf(ordersCount);
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/orders', () => {
    it('should create new order', (done) => {
      request(app)
        .post('/api/orders')
        .send({
          'orderId': '51',
          'companyName': 'test company',
          'customerAddress': 'test address',
          'orderedItem': 'test item',
          'orderType': 7
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.orderId)
            .to.equal('51');
          expect(res.body.companyName)
            .to.equal('test company');
          expect(res.body.customerAddress)
            .to.equal('test address');
          expect(res.body.orderedItem)
            .to.equal('test item');
          expect(res.body.orderType)
            .to.equal(7);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/orders', () => {

    it('should return array of orders and cache result', (done) => {
      request(app)
        .get('/api/orders')
        .expect(httpStatus.OK)
        .then((res) => {
          Order.count()
            .then(count => {
              expect(res.body)
                .to.have.lengthOf(count);
              done();
            });
        })
        .catch(done);
    });

    it('should create new order and clear cache', (done) => {
      request(app)
        .post('/api/orders')
        .send({
          'orderId': '60',
          'companyName': 'test company 60',
          'customerAddress': 'test address 60',
          'orderedItem': 'test item 60',
          'orderType': 8
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.orderId)
            .to.equal('60');
          expect(res.body.companyName)
            .to.equal('test company 60');
          expect(res.body.customerAddress)
            .to.equal('test address 60');
          expect(res.body.orderedItem)
            .to.equal('test item 60');
          expect(res.body.orderType)
            .to.equal(8);
          done();
        })
        .catch(done);
    });

    it('should fetch orders from DB and contain last created order', (done) => {
      request(app)
        .get('/api/orders')
        .expect(httpStatus.OK)
        .then((res) => {
          request(app)
            .get('/api/orders/50')
            .expect(httpStatus.OK)
            .then((response) => {
              expect(res.body)
                .to.deep.include(response.body);
              done();
            })
        })
        .catch(done);
    });
  });

  describe('# GET /api/orders?limit=10&page=10&min_type=2&max_type=5', () => {
    it('should apply filters correctly', (done) => {
      request(app)
        .get('/api/orders?limit=10&page=2&min_type=2&max_type=5')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.lengthOf(10);
          var wrongItems = res.body.find((item) => item.orderType < 2 || item.orderType > 5);
          assert.isUndefined(wrongItems);

          done();
        })
        .catch(done);
    });
  });

});
