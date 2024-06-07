const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();
const app = express();

// database 
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Error syncing database', err);
  });

app.use(bodyParser.json());

//routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/borrow', borrowRoutes);
app.use('/admin', adminRoutes);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server