const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { register, login } = require('../controllers/authController');
const User = require('../models/user');
const Admin = require('../models/admin');
const {registerSchema, loginSchema} = require('../schema/authSchema');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/user');
jest.mock('../models/admin');
jest.mock('../schema/authSchema');

describe('Auth Controller - Register', () => {
  let req, res;

  beforeEach(() => {
    req = {
      route: { path: '/register/user' },
      body: { email: 'test@example.com', password: 'password123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('should return 400 if validation fails', async () => {
    registerSchema.validate.mockReturnValue({ error: 'Validation error' });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: 'Validation error' });
  });

  test('should return 400 if user already exists', async () => {
    registerSchema.validate.mockReturnValue({ error: null });
    User.findOne.mockResolvedValue({ email: 'test@example.com' });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Email already exists');
  });

  test('should create a new user and return 201 with a token', async () => {
    registerSchema.validate.mockReturnValue({ error: null });
    User.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.create.mockResolvedValue({ id: '123' });
    jwt.sign.mockReturnValue('token');

    await register(req, res);

    expect(User.create).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashedPassword' });
    expect(jwt.sign).toHaveBeenCalledWith({ id: '123', isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1d' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '123', token: 'token' });
  });

  test('should handle server error', async () => {
    const error = new Error('Something went wrong');
    registerSchema.validate.mockReturnValue({ error: null });
    User.findOne.mockRejectedValue(error);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  test('should handle server error in catch block', async () => {
    const error = new Error('Unexpected error');
    registerSchema.validate.mockReturnValue({ error: null });
    User.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.create.mockRejectedValue(error);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});



describe('Auth Controller - Login', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: { email: 'test@example.com', password: 'password123', isAdmin: false }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      jest.clearAllMocks();
    });
  
    test('should return 400 if validation fails', async () => {
      loginSchema.validate.mockReturnValue({ error: 'Validation error' });
  
      await login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: 'Validation error' });
    });
  
    test('should return 400 if user does not exist', async () => {
      loginSchema.validate.mockReturnValue({ error: null });
      User.findOne.mockResolvedValue(null);
  
      await login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });
  
    test('should return 400 if password does not match', async () => {
      loginSchema.validate.mockReturnValue({ error: null });
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);
  
      await login(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });
  
    test('should return 201 with token if login is successful', async () => {
      loginSchema.validate.mockReturnValue({ error: null });
      User.findOne.mockResolvedValue({ id: '123', email: 'test@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');
  
      await login(req, res);
  
      expect(jwt.sign).toHaveBeenCalledWith({ id: '123', isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '1d' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: '123', token: 'token' });
    });

  });