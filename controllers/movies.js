const Movies = require('../models/movies');

const NotDataError = require('../errors/NotDataError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const NotRightsError = require('../errors/NotRightsError');

const getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const addMovie = (req, res, next) => {
  const movie = {
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    thumbnail: req.body.thumbnail,
    movieId: req.body.movieId,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    owner: req.user._id,
  };
  Movies.create(movie)
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const removeMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movies.findById(movieId)
    .then((data) => {
      if (!data) {
        throw new NotDataError('Карточки с данным _id несуществует');
      }
      if (!data.owner.equals(req.user._id)) {
        throw new NotRightsError('Вы не можите удалить данную карточку');
      }
      return Movies.deleteOne(data)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  addMovie,
  removeMovie,
};
