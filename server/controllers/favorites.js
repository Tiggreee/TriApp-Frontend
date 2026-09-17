const Favorite = require('../models/Favorite');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');

const getFavorites = (req, res, next) => {
  Favorite.find({ owner: req.user._id })
    .then((favorites) => res.send(favorites))
    .catch(next);
};

const createFavorite = (req, res, next) => {
  const { type, data } = req.body;

  Favorite.create({ type, data, owner: req.user._id })
    .then((favorite) => res.status(201).send(favorite))
    .catch(next);
};

const deleteFavorite = (req, res, next) => {
  Favorite.findById(req.params.id).select('+owner')
    .then((favorite) => {
      if (!favorite) {
        throw new NotFoundError('Favorite not found');
      }

      if (favorite.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Cannot delete another user\'s favorite');
      }

      return favorite.deleteOne()
        .then(() => res.send({ message: 'Favorite deleted' }));
    })
    .catch(next);
};

module.exports = { getFavorites, createFavorite, deleteFavorite };
