// Required libs
const { Router } = require('express');
const router = Router();

// Import middleware
const authMiddleware = require('../middleware/auth');

// Import Models
const Notebooks = require('../models/Notebooks');

// GET all notebooks
router.get('/', async (req, res) => {
  // populate -> userId ni id sidan tashqari email va name ini ham qaytaradi, oldingi holatda type: ObjectId bo'lgani u-n faqat _id ni qaytarardi xolos
  const notebooks = await Notebooks.find()
    .populate('userId', 'email name')
    .select('price title img description');
  // .select("price title") -> ma'lumotlar ichidan price va title ni qaytaradi, qolganalarini esa tashlab yuboradi
  res.render('notebooks', {
    title: 'Notebooks',
    isNotebooks: true,
    userId: req.user ? req.user._id.toString() : null,
    notebooks,
  });
});

// GET a notebook
router.get('/:id', async (req, res) => {
  const notebook = await Notebooks.findById(req.params.id);
  res.render('notebook', { layout: 'detail', title: notebook.title, notebook });
});

// GET Edit page
router.get('/:id/edit', authMiddleware, async (req, res) => {
  // Querylar ? dan keyin yozilganlari, link?allow=true
  if (!req.query.allow) {
    return res.redirect('/');
  }
  try {
    const notebook = await Notebooks.findById(req.params.id);

    if (notebook.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/notebooks');
    }

    res.render('notebook-edit', {
      layout: 'detail',
      title: `Edit ${notebook.title}`,
      notebook,
    });
  } catch (e) {
    console.log(e);
  }
});

// PUT Edit a notebook
router.post('/edit', authMiddleware, async (req, res) => {
  const { id } = req.body;
  // delete req.body.id;

  await Notebooks.findByIdAndUpdate(id, req.body);
  res.redirect('/notebooks');
});

// DELETE a notebook
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    await Notebooks.deleteOne({ _id: req.body.id });
    res.redirect('/notebooks');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
