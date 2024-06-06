const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const Book = require('../models/book');
const BookBorrowed = require('../models/bookBorrowed');
const { sequelize } = require('../config');

let adminToken, userToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const admin = await Admin.create({ username: 'admin', password: 'adminpass' });
  const user = await User.create({ username: 'user', password: 'userpass' });

  adminToken = jwt.sign({ id: admin.id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
  userToken = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

describe('Integration Tests', () => {
  let bookId;

  it('Admin should be able to add, update, and delete a book', async () => {
    // Admin adds a book
    let res = await request(app)
      .post('/books')
      .set('Authorization', `${adminToken}`)
      .send({
        title: 'Integration Book',
        author: 'Integration Author',
        isbn: '1234567890',
        publicationYear: 2022,
        quantity: 5
      });

    expect(res.status).toBe(201);
    bookId = res.body.id;

    // Admin updates the book
    res = await request(app)
      .put(`/books/${bookId}`)
      .set('Authorization', `${adminToken}`)
      .send({
        title: 'Updated Integration Book',
        author: 'Updated Integration Author',
        isbn: '0987654321',
        publicationYear: 2023,
        quantity: 10,
        status: 'available'
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Integration Book');

    // Admin deletes the book
    res = await request(app)
      .delete(`/books/${bookId}`)
      .set('Authorization', `${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Book deleted');
  });

  it('User should not be able to add, update, or delete a book', async () => {
    // User tries to add a book
    let res = await request(app)
      .post('/books')
      .set('Authorization', `${userToken}`)
      .send({
        title: 'User Book',
        author: 'User Author',
        isbn: '1122334455',
        publicationYear: 2022,
        quantity: 5
      });

    expect(res.status).toBe(403);

    // User tries to update a book
    res = await request(app)
      .put(`/books/${bookId}`)
      .set('Authorization', `${userToken}`)
      .send({
        title: 'User Updated Book',
        author: 'User Updated Author',
        isbn: '5544332211',
        publicationYear: 2023,
        quantity: 10,
        status: 'available'
      });

    expect(res.status).toBe(403);

    // User tries to delete a book
    res = await request(app)
      .delete(`/books/${bookId}`)
      .set('Authorization', `${userToken}`);

    expect(res.status).toBe(403);
  });

  it('Admin should be able to see all overdue books', async () => {
    const book = await Book.create({
      title: 'Overdue Integration Book',
      author: 'Overdue Integration Author',
      isbn: '4455667788',
      publicationYear: 2018,
      quantity: 2,
      createdBy: 1
    });
    bookId = book.id;

    await BookBorrowed.create({
      userId: 1,
      bookId,
      borrowDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-10'),
      returnDate: null
    });

    const res = await request(app)
      .get('/books/overdue')
      .set('Authorization', `${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('bookId', bookId);
  });

  it('User should not be able to see overdue books', async () => {
    const res = await request(app)
      .get('/books/overdue')
      .set('Authorization', `${userToken}`);

    expect(res.status).toBe(403);
  });
});
