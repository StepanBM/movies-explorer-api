const express = require('express');

require('dotenv').config();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const helmet = require('helmet');

const { errors } = require('celebrate');

const { cors } = require('./middlewares/cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');

const serverError = require('./errors/ServerError');

const NotDataError = require('./errors/NotDataError');

const { PORT = 3000, ADDRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(requestLogger);

app.use(cors);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use('', (req, res, next) => {
  next(new NotDataError('Данного пути не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use(serverError);

mongoose.connect(ADDRESS);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
