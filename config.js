const { Sequelize } = require('sequelize');
const path = require('path');
const Op = Sequelize.Op;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'library.sqlite')
});

module.exports = sequelize;
