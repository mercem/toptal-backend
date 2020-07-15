const _ = require('lodash');
const { Category } = require('./model');
const { USER_ROLES } = require('../../common/constants');

module.exports.create = (req, res) => {
  if (req.user.role !== USER_ROLES.ADMIN) {
    res.status(401).send('Only admins can create category.');
  } else {
    const category = new Category(_.pick(req.body, ['name']));
    category
      .save()
      .then(() => res.send({ category }))
      .catch(({ message }) => res.status(400).send(message));
  }
};

module.exports.find = (req, res) => {
  Category.find(req.query)
    .then((docs) => res.send(docs))
    .catch(({ message }) => res.status(400).send(message));
};
