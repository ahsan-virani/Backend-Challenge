# Backend Code Challenge


## Instructions


#### Docker

```shell
npm install
docker-compose up
```

This will first run the tests, then start the server.

#### Dev and Test

To run server locally, and for test, make sure Mongo and redis instances are up.

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

GET `/api/orders?page=1&limit=22&max_type=10&min_type=9`

POST `/api/orders`
