const router = require('express').Router();
const controller = require('./controller');
const { authendicate } = require('../../middleware/auth');

// GETS
router.get('/', controller.find);

// POSTS
router.post('/', authendicate, controller.create);

module.exports = router;
