const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getFavorites, createFavorite, deleteFavorite } = require('../controllers/favorites');

router.get('/', getFavorites);

router.post('/', celebrate({
  body: Joi.object().keys({
    type: Joi.string().required().valid('music', 'color', 'avatar'),
    data: Joi.object().required(),
  }),
}), createFavorite);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), deleteFavorite);

module.exports = router;
