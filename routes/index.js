const router = require('express').Router();
const userRoutes = require('./users');
const moviesRoutes = require('./movie');
const { validatorLogin, validatorAddUser } = require('../middlewares/validator');

const { login, addUser } = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.post('/signin', validatorLogin, login);
router.post('/signup', validatorAddUser, addUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', moviesRoutes);

module.exports = router;
