/* eslint-disable no-param-reassign, no-underscore-dangle */
const _ = require('lodash');
const { User } = require('./model');
const { USER_ROLES } = require('../../common/constants');
const { verifyPassword } = require('./helper');

module.exports.create = (req, res) => {
  const user = new User(
    _.pick(req.body, [
      'email',
      'password',
      'firstName',
      'lastName',
      'country',
      'city',
    ])
  );
  user
    .save()
    .then(() => user.generateAuthToken())
    .then((token) => {
      res.send({ user, token });
    })
    .catch(({ message }) => res.status(400).send(message));
};

module.exports.me = (req, res) => {
  res.send(req.user);
};

module.exports.find = (req, res) => {
  User.find(req.query)
    .then((docs) => res.send(docs))
    .catch(({ message }) => res.status(400).send(message));
};

module.exports.login = (req, res) => {
  const creds = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(creds)
    .then((userAndToken) => res.send(userAndToken))
    .catch(({ message }) => res.status(404).send(message));
};

module.exports.findById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.numberOfEnquire += 1;
      user.save().then((updatedUser) => res.send(updatedUser));
    })
    .catch(({ message }) => res.status(400).send(message));
};

module.exports.update = (req, res) => {
  const {
    userId,
    email,
    firstName,
    lastName,
    country,
    city,
    categoryIds,
    subCategoryIds,
  } = req.body;

  const isAdmin = req.user.role === USER_ROLES.ADMIN;
  const isSame = req.user._id.toString() === userId;

  if (!isAdmin && !isSame) {
    res.status(401).send('insufficient permission');
  } else {
    User.findById(userId)
      .then((user) => {
        if (user) {
          if (email) user.email = email;
          if (firstName) user.firstName = firstName;
          if (lastName) user.lastName = lastName;
          if (country) user.country = country;
          if (city) user.city = city;
          if (categoryIds) {
            user.categoryIds = categoryIds;
            user.markModified('categoryIds');
          }
          if (subCategoryIds) {
            user.subCategoryIds = subCategoryIds;
            user.markModified('subCategoryIds');
          }
          user
            .save()
            .then((updatedUser) => res.send(updatedUser))
            .catch(({ message }) => res.status(400).send(message));
        } else {
          throw new Error('User not found.');
        }
      })
      .catch(({ message }) => res.status(404).send(message));
  }
};

module.exports.updatePassword = (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  const isAdmin = req.user.role === USER_ROLES.ADMIN;
  const isSame = req.user._id.toString() === userId;

  if (!isAdmin && !isSame) {
    res.status(401).send('insufficient permission');
  } else {
    User.findOne({ _id: userId })
      .then(async (user) => {
        if (!user) return Promise.reject(new Error('User not found.'));
        if (isAdmin) {
          user.password = newPassword;
          return user.save();
        }
        if (isSame) {
          if (verifyPassword(oldPassword, user.password)) {
            user.password = newPassword;
            return user.save();
          }
        }

        return Promise.reject(new Error('Incorrect password.'));
      })
      .then((updatedUser) => res.send(updatedUser))
      .catch(({ message }) => res.status(404).send(message));
  }
};
