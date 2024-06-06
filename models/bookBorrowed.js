const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./user');
const Book = require('./book');

const BookBorrowed = sequelize.define('BookBorrowed', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id'
    }
  },
  borrowDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  book_status: {
    type: DataTypes.STRING,
    defaultValue: "borrowed"
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

User.hasMany(BookBorrowed, { foreignKey: 'userId' });
Book.hasMany(BookBorrowed, { foreignKey: 'bookId' });
BookBorrowed.belongsTo(User, { foreignKey: 'userId' });
BookBorrowed.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = BookBorrowed;
