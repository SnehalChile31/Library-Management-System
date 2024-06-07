const { addBook, updateBook, deleteBook } = require('../controllers/bookController');
const Book = require('../models/book');
const {addBookSchema, updateBookSchema} = require('../schema/bookSchema');

jest.mock('../models/book');
jest.mock('../schema/bookSchema');


describe('addBook', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        title: 'Book Title',
        author: 'Author Name',
        isbn: '978-3-16-148410-0',
        publicationYear: 2022,
        actualQuantity: 10,
        currentQuantity: 10
      },
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('should create a new book and return 201 status', async () => {
    addBookSchema.validate.mockReturnValue({ error: null });
    Book.create.mockResolvedValue({ id: 1 });

    await addBook(req, res);

    expect(addBookSchema.validate).toHaveBeenCalledWith(req.body);
    expect(Book.create).toHaveBeenCalledWith({
      title: 'Book Title',
      author: 'Author Name',
      isbn: '978-3-16-148410-0',
      publicationYear: 2022,
      actualQuantity: 10,
      currentQuantity: 10,
      createdBy: 1,
      updatedBy: 1
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, message: 'book added successfully' });
  });

  test('should return 400 if schema validation fails', async () => {
    addBookSchema.validate.mockReturnValue({ error: 'Validation error' });

    await addBook(req, res);

    expect(addBookSchema.validate).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: 'Validation error' });
  });

});


describe('updateBook', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: {
        title: 'Updated Book Title',
        author: 'Updated Author Name',
        isbn: '978-3-16-148410-0',
        publicationYear: 2022,
        actualQuantity: 15,
        currentQuantity: 15
      },
      user: { id: 1 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('should update a book and return 200 status', async () => {
    updateBookSchema.validate.mockReturnValue({ error: null });

    const mockBook = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      title: '',
      author: '',
      isbn: '',
      publicationYear: '',
      actualQuantity: '',
      currentQuantity: '',
      updatedBy: ''
    };
    Book.findByPk.mockResolvedValue(mockBook);

    await updateBook(req, res);

    expect(updateBookSchema.validate).toHaveBeenCalledWith(req.body);
    expect(Book.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(mockBook.save).toHaveBeenCalled();
    expect(mockBook.title).toBe(req.body.title);
    expect(mockBook.author).toBe(req.body.author);
    expect(mockBook.isbn).toBe(req.body.isbn);
    expect(mockBook.publicationYear).toBe(req.body.publicationYear);
    expect(mockBook.actualQuantity).toBe(req.body.actualQuantity);
    expect(mockBook.currentQuantity).toBe(req.body.currentQuantity);
    expect(mockBook.updatedBy).toBe(req.user.id);
    expect(res.status).not.toHaveBeenCalledWith(400);
  });

  test('should return 400 if schema validation fails', async () => {
    updateBookSchema.validate.mockReturnValue({ error: 'Validation error' });

    await updateBook(req, res);

    expect(updateBookSchema.validate).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: 'Validation error' });
  });

  test('should return 404 if book is not found', async () => {
    updateBookSchema.validate.mockReturnValue({ error: null });
    Book.findByPk.mockResolvedValue(null);

    await updateBook(req, res);

    expect(updateBookSchema.validate).toHaveBeenCalledWith(req.body);
    expect(Book.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Book not found' });
  });

});



describe('deleteBook', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { id: 1 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('should delete a book and return 200 status', async () => {
    const mockBook = {
      save: jest.fn().mockResolvedValue(true),
      is_deleted: 0
    };

    Book.findByPk = jest.fn().mockResolvedValue(mockBook);

    await deleteBook(req, res);

    expect(Book.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(mockBook.is_deleted).toBe(1);
    expect(mockBook.save).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Book deleted' });
  });

  test('should return 404 if book is not found', async () => {
    Book.findByPk = jest.fn().mockResolvedValue(null);

    await deleteBook(req, res);

    expect(Book.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Book not found' });
  });

});
