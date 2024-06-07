const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const Book = require('../models/book');
const BookBorrowed = require('../models/bookBorrowed');
const sequelize  = require('../config');
require('dotenv').config();

let adminToken, userToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const admin = await Admin.create({ email: 'admin1@gmail.com', password: 'adminpass' });
  const user = await User.create({ email: 'user1@gmail.com', password: 'userpass' });

  adminToken = jwt.sign({ id: admin.id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
  userToken = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
    await sequelize.close();
  });

describe('Book Controller', () => {
  describe('add books', () => {
    it('should allow admin to add a book', async () => {
      const res = await request(app).post('/books/addBook')
        .set('Authorization', `${adminToken}`)
        .send({
          title: "Test Book",
          author: "Test Author",
          isbn: "1234567890",
          publicationYear: 2022,
          actualQuantity: 5,
          currentQuantity:5
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('message');


    });

    it('should not allow a user to add a book', async () => {

      const res = await request(app)
        .post('/books/addBook')
        .set('Authorization', `${userToken}`)
        .send({
          title: "Test Book",
          author: "Test Author",
          isbn: "1234567890",
          publicationYear: 2022,
          actualQuantity: 5,
          currentQuantity:5
        });
      expect(res.status).toBe(403);
    });
  });

  describe('update book', () => {
    let bookId;

    beforeAll(async () => {
      const book = await Book.create({
        title: 'Initial Book',
        author: 'Initial Author',
        isbn: '0987654321',
        publicationYear: 2021,
        actualQuantity: 5,
        currentQuantity:5,
        createdBy: 1,
        updatedBy: 1
      });
      bookId = book.id;
    });

    it('should allow admin to update a book', async () => {
      const res = await request(app)
        .post(`/books/update/${bookId}`)
        .set('Authorization', `${adminToken}`)
        .send({
          title: 'Updated Book',
          author: 'Updated Author',
          isbn: '1234509876',
          publicationYear: 2023,
          actualQuantity: 15,
          currentQuantity:15
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('message');
    });

    it('should not allow a user to update a book', async () => {
      const res = await request(app)
        .post(`/books/update/${bookId}`)
        .set('Authorization', `${userToken}`)
        .send({
          title: 'Updated Book',
          author: 'Updated Author',
          isbn: '1234509876',
          publicationYear: 2023,
          actualQuantity: 15,
          currentQuantity:15
        });
        
        expect(res.status).toBe(403);
    });
  });

  describe('DELETE book', () => {
    let bookId;

    beforeAll(async () => {
      const book = await Book.create({
        title: 'Initial Book',
        author: 'Initial Author',
        isbn: '0987654321',
        publicationYear: 2021,
        actualQuantity: 5,
        currentQuantity:5,
        createdBy: 1,
        updatedBy: 1
      });
      bookId = book.id;
    });

    it('should allow admin to delete a book', async () => {
      const res = await request(app)
        .post(`/books/delete/${bookId}`)
        .set('Authorization', `${adminToken}`);

      expect(res.status).toBe(200);
    });

    it('should not allow a user to delete a book', async () => {
      const res = await request(app)
        .post(`/books/delete/${bookId}`)
        .set('Authorization', `${userToken}`);

      expect(res.status).toBe(403);
    });
  });


  describe('GET /books/overdue', () => {
    let bookId;

    beforeAll(async () => {
      const book = await Book.create({
        title: 'Book10',
        author: 'Initial Author',
        isbn: '09876543284',
        publicationYear: 2021,
        actualQuantity: 5,
        currentQuantity:5,
        createdBy: 1,
        updatedBy: 1
      });
      bookId = book.id;

      await BookBorrowed.create({
        userId: 1,
        bookId,
        borrowDate: new Date('2024-01-01'),
        dueDate: new Date('2024-01-10'),
        returnDate: null
      });
    });

    it('should allow admin to see all overdue books', async () => {
      const res = await request(app)
        .post('/admin/overdueBooks')
        .set('Authorization', `${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should not allow a user to see overdue books', async () => {
      const res = await request(app)
      .post('/admin/overdueBooks')
      .set('Authorization', `${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});
