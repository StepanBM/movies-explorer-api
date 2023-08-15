const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

const NotDataError = require('../errors/NotDataError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const EmailExistsError = require('../errors/EmailExistsError');

const getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotDataError('Пользователь по указанному _id не найден');
      }
      const { email, name } = user;
      return res.status(200).send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Некорректный _id'));
      }
      next(err);
    });
};

const addUser = (req, res, next) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  bcrypt.hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      User.create(user)
        .then(() => {
          delete user.password;
          res.status(200).send(user);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new IncorrectDataError('Переданы некорректные данные'));
          } else if (err.code === 11000) {
            next(new EmailExistsError('Пользователь с таким email уже существует'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const userInfo = {
    name: req.body.name,
    email: req.body.email,
  };
  User.findByIdAndUpdate(req.user._id, userInfo, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotDataError('Пользователь по указанному _id не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(() => {
      // Создадим токен
      User.findOne({ email }).select('+password')
        .then((user) => {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          // Вернём токен
          res.status(200).send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  addUser,
  updateUserInfo,
  login,
  getUserMe,
};
