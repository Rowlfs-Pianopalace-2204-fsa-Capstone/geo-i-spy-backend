/** @format */

const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/challenges', require('./challenges'));
router.use('/achievements', require('./achievements'));
router.use('/cloudinary', require('./cloudinary'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
