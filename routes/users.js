const router = require('express').Router();
const {
  getUserMe,
  updateUserInfo,
} = require('../controllers/users');

const {
  validatorUpdateUser,
} = require('../middlewares/validator');

router.get('/me', getUserMe);
router.patch('/me', validatorUpdateUser, updateUserInfo);
module.exports = router;
