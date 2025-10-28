const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('./config/passport');

const sessionsRoutes = require('./routes/sessions.routes');
const usersRoutes = require('./routes/users.routes');
const productsRoutes = require('./routes/products.routes');
const cartsRoutes = require('./routes/carts.routes');
const checkoutRoutes = require('./routes/checkout.routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(passport.initialize());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/sessions', sessionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/checkout', checkoutRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
