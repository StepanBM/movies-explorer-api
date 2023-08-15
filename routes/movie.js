const router = require('express').Router();
const {
  getMovies,
  addMovie,
  removeMovie,
} = require('../controllers/movies');

const {
  validatorMovieId,
  validatorAddMovie,
} = require('../middlewares/validator');

router.get('/', getMovies);
router.post('/', validatorAddMovie, addMovie);
router.delete('/:movieId', validatorMovieId, removeMovie);

module.exports = router;
