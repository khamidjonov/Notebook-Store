const { Schema, model } = require('mongoose');

const User = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  avatarUrl: String,
  password: String,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        notebookId: {
          type: Schema.Types.ObjectId,
          // Notebook nomli Schemani olib keladi
          ref: 'Notebook',
          required: true,
        },
      },
    ],
  },
});

// Bu yerda User Schemasiga method yaratiladi. Method yaratayotganda Function expression dan foydalanish kerak, chunki bunda Context this mavjud, Arrow Functionda esa mavjud emas
User.methods.addToCart = function (notebook) {
  let items = [...this.cart.items];
  const index = items.findIndex((s) => {
    return s.notebookId.toString() === notebook._id.toString();
  });

  if (index >= 0) {
    items[index].count = items[index].count + 1;
  } else {
    items.push({
      notebookId: notebook._id,
      count: 1,
    });
  }

  // const newCart = { items: items };
  // this.cart = newCart;

  this.cart = { items };
  return this.save();
};

User.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const index = items.findIndex(
    (s) => s.notebookId.toString() === id.toString()
  );

  if (items[index].count === 1) {
    items = items.filter((s) => s.notebookId.toString() !== id.toString());
  } else {
    items[index].count--;
  }

  this.cart = { items };
  return this.save();
};

User.methods.cleanCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model('User', User);
