const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const auth = require('../middleware/auth');
const usersRouter = require('./users');
const favoritesRouter = require('./favorites');
const NotFoundError = require('../utils/NotFoundError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/favorites', favoritesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Resource not found'));
});

module.exports = router;
