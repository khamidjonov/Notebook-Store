// Required libs
const { Router } = require('express');
const router = Router();

// Import middleware
const authMiddleware = require('../middleware/auth');

// Import Models
const Notebooks = require('../models/Notebooks');

// Necessary funtions
const mapCart = (cart) => {
  return cart.items.map((s) => ({
    // doc_ Documentdagi ortiqcha taglar
    ...s.notebookId._doc,
    id: s.notebookId.id,
    count: s.count,
  }));
};

const wholePrice = (notebooks) => {
  return notebooks.reduce((total, notebook) => {
    return (total += notebook.price * notebook.count);
  }, 0);
};

router.post('/add', authMiddleware, async (req, res) => {
  const notebook = await Notebooks.findById(req.body.id);
  await req.user.addToCart(notebook);
  res.redirect('/notebooks');
});

router.get('/', authMiddleware, async (req, res) => {
  const user = await req.user.populate('cart.items.notebookId');
  // console.log(user);
  const notebooks = mapCart(user.cart);

  res.render('card', {
    title: 'Basket',
    isCard: true,
    notebooks: notebooks,
    price: wholePrice(notebooks),
  });
});

router.delete('/remove/:id', authMiddleware, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.notebookId');
  const notebooks = mapCart(user.cart);
  const cart = {
    notebooks,
    price: wholePrice(notebooks),
  };

  res.status(200).json(cart);
});

module.exports = router;
