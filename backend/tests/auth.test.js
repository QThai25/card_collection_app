// auth.test.js - Test cho đăng ký và đăng nhập (sử dụng Jest và supertest)
const request = require('supertest');
const app = require('../server'); // Import server để test
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({}); // Xóa user sau mỗi test
  });

  it('Nên đăng ký user mới', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: '123456',
        name: 'Test User',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('Nên đăng nhập user', async () => {
    // Tạo user trước
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: '123456',
        name: 'Test User',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: '123456',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});