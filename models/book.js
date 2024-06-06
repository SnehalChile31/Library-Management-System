const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const Admin = require('./admin');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  actualQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currentQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.SMALLINT,
    defaultValue : 0,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: Admin,
      key: 'id'
    },
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: Admin,
      key: 'id'
    },
    allowNull: true
  }
});

Book.belongsTo(Admin, { as: 'creator', foreignKey: 'createdBy' });
Book.belongsTo(Admin, { as: 'updater', foreignKey: 'updatedBy' });

module.exports = Book;
