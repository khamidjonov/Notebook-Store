// Import required libs
const { body } = require('express-validator');

// Import model
const User = require('../models/User');

// Errorni withname b-n yozish yoki form.name dan keyin yozish bir xil vazifani bajaradi
// .custom orqali yangi ixtiyoriy method yaratiladi
// .isAlphanumeric -> barcha belgi faqat harf yoki raqamligini tekshiradi
// .noremalizeEmail -> emaildan keraksiz belgilarni olib tashlaydi, masalan, " + .  " va katta harflarni ham kichigiga alishtirib beradi

exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter correct email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });

        if (user) {
          return Promise.reject('This email is already exist');
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body('password', 'Password should have at least 6 symbols')
    .isLength({
      min: 6,
      max: 36,
    })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password should match each other');
      }
      return true;
    })
    .trim(),
  body('name', 'Name should have minimum 3 symbols')
    .isLength({ min: 3 })
    .trim(),
];

exports.notebookValidators = [
  body('title')
    .isLength({ min: 3 })
    .withMessage('Title should have minimum 3 characters'),
  body('price').isNumeric().withMessage('Write valid price'),
  body('img', 'Type correct image URL').isURL(),
  body('description')
    .isLength({ min: 10 })
    .withMessage('Description should have at least 10 characters'),
];
