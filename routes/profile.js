// Import required libs
const router = require('express').Router();

// Import models
const User = require('../models/User');

// Import middleware
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  res.render('profile', {
    title: 'Profile',
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toChange = {
      name: req.body.name,
    };
    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }
    Object.assign(user, toChange);

    await user.save();

    res.redirect('/profile');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
