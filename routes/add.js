// Required libs
const { Router } = require('express');
const router = Router();
const { validationResult } = require('express-validator');

// Import middleware
const authMiddleware = require('../middleware/auth');

// Import Models
const Notebooks = require('../models/Notebooks');

// Import Validator
const { notebookValidators } = require('../utils/validators');

// Validator middlewaredan keyin qo'yiladi
router.get('/', authMiddleware, notebookValidators, (req, res) => {
  res.render('add', { title: 'Add notebook', isAdd: true });
});

router.post('/', authMiddleware, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Pastdagilar xatodan keyingi o'chib ketgan ma'lumotni to'g'irlash uchun k-k.
    return res.status(422).render('add', {
      title: 'Add notebook',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        img: req.body.img,
      },
    });
  }

  const notebook = new Notebooks({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    img: req.body.img,
    // Modelsdagi Notebook Schemasida userId type ga ObjectId (Userdagi) berilgani u-n avtomatik User id ni oladi yoki req.user._id qilib bersa ham bo'ladi
    userId: req.user,
  });

  try {
    await notebook.save();
    res.redirect('/notebooks');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
