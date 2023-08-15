const { celebrate, Joi } = require('celebrate');

const validatorAddUser = celebrate({
  body: Joi.object().keys({
    name:
    Joi.string().min(2).max(30).required(),
    email:
    Joi.string().required().email(),
    password:
    Joi.string().required(),
  }),
});

const validatorUpdateUser = celebrate({
  body: Joi.object().keys({
    name:
    Joi.string().min(2).max(30).required(),
    email:
    Joi.string().required().email(),
  }),
});

const validatorUserId = celebrate({
  params: Joi.object().keys({
    userId:
    Joi.string().required().length(24).hex(),
  }),
});

const validatorMovieId = celebrate({
  params: Joi.object().keys({
    movieId:
    Joi.string().required().length(24).hex(),
  }),
});

const validatorAddMovie = celebrate({
  body: Joi.object().keys({
    country:
    Joi.string().required(),
    director:
    Joi.string().required(),
    duration:
    Joi.number().required(),
    year:
    Joi.string().required(),
    description:
    Joi.string().required(),
    image:
    Joi.string().required().uri(),
    trailerLink:
    Joi.string().required().uri(),
    thumbnail:
    Joi.string().required().uri(),
    movieId:
    Joi.number().required(),
    nameRU:
    Joi.string().required(),
    nameEN:
    Joi.string().required(),
  }),
});

const validatorLogin = celebrate({
  body: Joi.object().keys({
    email:
    Joi.string().required().email(),
    password:
    Joi.string().required(),
  }),
});

module.exports = {
  validatorAddUser,
  validatorUpdateUser,
  validatorUserId,
  validatorMovieId,
  validatorAddMovie,
  validatorLogin,
};
