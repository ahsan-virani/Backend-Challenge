# Backend Code Challenge


## Instructions


```shell
npm install
npm run test
docker-compose up
```

To run locally, make sure Mongo and redis instances are up.

```shell
npm install
npm run test
npm run db:seed // if you wish to seed
npm start
```
#### routes:

go to `localhost:3000/api/test` to see service is running

GET `/api/orders/:order_id`

PUT `/api/orders/:order_id`

DELETE `/api/orders/:order_id`

GET `/api/orders`

POST `/api/orders`
