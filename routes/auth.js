// Required libs
const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
// Validatorni kerakli methodlarini chaqirish
const { body, validationResult } = require('express-validator');

// Export Validator from utils
const { registerValidators } = require('../utils/validators');

// Import Model
const User = require('../models/User');

router.get('/login', (req, res) => {
  // view ni ichidagi auth papkadagi login.hbs faylini render qiladi
  res.render('auth/login', {
    title: 'Register',
    isLogin: true,
    // Flash dagi ma'lumotni engine filega jo'natish
    regError: req.flash('regError'),
    loginError: req.flash('loginError'),
  });
});

router.get('/logout', (req, res) => {
  // Sessiondagi datani o'chirish va redirect qilish
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = User.findOne({ email });

    if (candidate) {
      // Password ni 'bcrypt' orqali tekshirish
      const samePass = bcrypt.compare(password, candidate.password);

      if (samePass) {
        // Session ga yangi user nomli o'zgaruvchi ochish va qiymatini yuqoridagi userga tenglash
        req.session.user = candidate;

        req.session.isAuthenticated = true;

        // Sessionning yangi qiymatlarini saqlash
        req.session.save((err) => {
          if (err) throw err;

          // Redirect xatolardan qochish uchun save ni ichida yoziladi
          res.redirect('/');
        });
      } else {
        req.flash('loginError', 'Password is wrong');
      }
    } else {
      req.flash('loginError', "This username isn't found");
      res.redirect('/auth/login#login');
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, name, password, confirm } = req.body;
    // const candidate = await User.findOne({ email });

    // req dan kelgan xatolarni olish va engine file ga jo'natish
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('regError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }

    const hashPas = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      name: name,
      password: hashPas,
      cart: {
        items: [],
      },
    });

    await user.save();

    res.redirect('/auth/login#login');

    // if (candidate) {
    //   // error keywordi bilan ma'lumotni saqlash, bu yerda POST va GET metodlarini bog'layapti
    //   req.flash('regError', 'This email is already exist');
    //   res.redirect('/auth/login#register');
    // } else {
    //   // Password ni hash qilish
    //   const hashPas = await bcrypt.hash(password, 10);

    //   const user = new User({
    //     email: email,
    //     name: name,
    //     password: hashPas,
    //     cart: {
    //       items: [],
    //     },
    //   });

    //   await user.save();

    //   res.redirect('/auth/login#login');
    // }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
