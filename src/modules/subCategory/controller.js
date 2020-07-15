const _ = require('lodash');
const { SubCategory } = require('./model');
const { USER_ROLES } = require('../../common/constants');

module.exports.create = (req, res) => {
  if (req.user.role !== USER_ROLES.ADMIN) {
    res.status(401).send('Only admins can create category.');
  } else {
    const subCategory = new SubCategory(_.pick(req.body, ['name', 'category']));
    subCategory
      .save()
      .then(() => res.send({ subCategory }))
      .catch(({ message }) => res.status(400).send(message));
  }
};

module.exports.find = (req, res) => {
  SubCategory.find(req.query)
    .then((docs) => res.send(docs))
    .catch(({ message }) => res.status(400).send(message));
};
