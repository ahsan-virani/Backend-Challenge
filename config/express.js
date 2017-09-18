import express from 'express';
import bodyParser from 'body-parser';
import httpStatus from 'http-status';
import expressValidation from 'express-validation';
import routes from '../server/routes/index.route';
import config from './config';
import path from 'path';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((req, res, next) => {
  const customError = { message: 'API not found', status: httpStatus.NOT_FOUND };
  return next(customError);
});

app.use((err, req, res, next) => {
  let unifiedErrorMessage = err.message;
  if (err instanceof expressValidation.ValidationError) {
    unifiedErrorMessage = err.errors.map(error => error.messages.join('. '))
      .join(' and ');
  }
  res.status(err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: unifiedErrorMessage, innerError: err });
})

export default app;
