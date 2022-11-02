// Required libraries
const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session); // chaqirish va ishlatish
const flash = require('connect-flash');

// Imported routes
const homeRoutes = require('./routes/home');
const notebooksRoutes = require('./routes/notebooks');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Import Middleware
const varMiddleware = require('./middleware/var');
const userMiddleware = require('./middleware/user');
const errorMiddleware = require('./middleware/error');
const fileMiddleware = require('./middleware/file');

// Importes modules
const User = require('./models/User');

// Initialize Express
const app = express();

const MONGODB_URL =
  'mongodb+srv://khamidjonov:q1w2e3r4@laptop-shop.oro9wrg.mongodb.net/shop';

// Using mongoStore
const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URL,
});

// Register or set libs
app.use(
  session({
    secret: 'secret val', //secret value qo'yish
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(flash());

// Engine configs
const hbs = exphbs.create({
  defaultLayout: 'main.hbs',
  extname: 'hbs',
  // Helpers
  helpers: require('./utils/index'),
  // layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: [path.join(__dirname, 'views/partials')],
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

// Set engine
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// Find a user
// app.use(async (req, res, next) => {
//   try {
//     // Request ga yangi user nomli xossa yaratadi (req.body kabi) va uni qiymatini user ga tenglashtiradi
//     const user = await User.findById('635d0e376016f8459cc1783c');
//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// });

// SET Public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// URLEncoded
app.use(express.urlencoded({ extended: true })); // It helps work with forms, it's default value is false. We should change it to true

// Using middleware
app.use(fileMiddleware.single('avatar'));
app.use(varMiddleware);
app.use(userMiddleware);

// Using routes
app.use('/', homeRoutes); // Oldidagisi prefix
app.use('/notebooks', notebooksRoutes); // Oldidagisi prefix
app.use('/add', addRoutes); // Oldidagisi prefix
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// 404 Page Not Found sahifasi barcha routelardan keyin eng oxirida yoziladi
app.use(errorMiddleware);

// Connect to MongoDB
async function start() {
  try {
    // Qo'shimcha configure larni ham yozib qo'yish kerak
    await mongoose.connect(MONGODB_URL, { useNewUrlParser: true });

    // const candidate = User.findOne();

    // if (!candidate) {
    //   const user = new User({
    //     email: 'khamidjonovbotirjon@gmail.com',
    //     name: 'Botirjon',
    //     cart: {
    //       items: [],
    //     },
    //   });

    //   await user.save();
    // }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server has started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
