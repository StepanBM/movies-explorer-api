const express = require('express');

require('dotenv').config();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const helmet = require('helmet');

const { errors } = require('celebrate');

const userRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movie');

const { login, addUser } = require('./controllers/users');

const { auth } = require('./middlewares/auth');

const { cors } = require('./middlewares/cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { validatorLogin, validatorAddUser } = require('./middlewares/validator');

const serverError = require('./errors/ServerError');

const NotDataError = require('./errors/NotDataError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(requestLogger);

app.use(cors);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', validatorLogin, login);
app.post('/signup', validatorAddUser, addUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/movies', moviesRoutes);

app.use('', (req, res, next) => {
  next(new NotDataError('Данного пути не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use(serverError);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
