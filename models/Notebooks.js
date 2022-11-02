const { Schema, model } = require('mongoose');

const Notebook = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    // User nomli Schemadan _id sini olib keladi
    ref: 'User',
    required: true,
  },
});

// Notebook ni ID sini _id dan id ga o'zgartirish
Notebook.method('toClient', function () {
  const notebook = this.toObject();
  notebook.id = notebook._id;
  delete notebook._id;

  return notebook;
});

module.exports = model('Notebook', Notebook);
