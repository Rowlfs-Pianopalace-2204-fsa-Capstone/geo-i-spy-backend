/** @format */

const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/challenges', require('./challenges'));
router.use('/followers', require('./followers'));
router.use('/achievements', require('./achievements'));
router.use('/messages', require('./messages'));
router.use('/rooms', require('./rooms'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
