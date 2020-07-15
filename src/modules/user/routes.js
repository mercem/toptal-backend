const router = require('express').Router();
const controller = require('./controller');
const { authendicate } = require('../../middleware/auth');

// GETS
router.get('/', controller.find);
router.get('/me', authendicate, controller.me);
router.get('/:id', controller.findById); // always put to the end

// POSTS
router.post('/', controller.create);
router.post('/login', controller.login);
router.post('/update', authendicate, controller.update);
router.post('/updatePassword', authendicate, controller.updatePassword);

module.exports = router;
