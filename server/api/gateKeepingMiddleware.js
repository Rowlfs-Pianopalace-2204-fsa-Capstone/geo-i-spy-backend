/** @format */

const {
  models: { User },
} = require('../db');

const requireToken = async (req, res, next) => {
  try {
    //This will pull the user token from the headers, make sure you add it to the headers in the redux store by getting it from window.localStorage.getItem('token') then sending it to whatever route has this middleware by   await axios.get('/your/rout', {
    //   headers: {
    //     authorization: theTokenYouGot,
    //   },
    // });
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send('Nice try');
  } else {
    next();
  }
};
module.exports = {
  requireToken,
  isAdmin,
};
