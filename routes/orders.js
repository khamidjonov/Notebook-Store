// Required libs
const { Router } = require('express');
const router = Router();

// Import middleware
const authMiddleware = require('../middleware/auth');

// Import Models
const Order = require('../models/Order');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id }).populate(
      'user.userId'
    );
    res.render('orders', {
      isOrder: true,
      title: 'Orders',
      orders: orders.map((s) => ({
        ...s._doc,
        price: s.notebooks.reduce((total, c) => {
          return (total += c.count * c.notebook.price);
        }, 0),
      })),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.notebookId');
    const notebooks = user.cart.items.map((s) => ({
      count: s.count,
      notebook: { ...s.notebookId._doc },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      notebooks,
    });
    await order.save();
    await req.user.cleanCart();
    res.redirect('/orders');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
