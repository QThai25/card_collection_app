// scan.test.js - Test cho quét QR
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Card = require('../models/Card');
const jwt = require('jsonwebtoken');

describe('Scan API', () => {
  let token;
  let cardId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    // Tạo user
    const user = await new User({
      email: 'test@example.com',
      passwordHash: await require('bcryptjs').hash('123456', 10),
      name: 'Test User',
    }).save();
    token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);

    // Tạo card
    const card = await new Card({
      code: 'CARD-TEST',
      title: 'Test Card',
      description: 'Test',
      rarity: 'Rare',
    }).save();
    cardId = card._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Nên quét và thêm thẻ hợp lệ', async () => {
    const res = await request(app)
      .post('/api/users/scan')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'CARD-TEST' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('Đã thêm thẻ');
  });

  it('Nên lỗi nếu mã sai', async () => {
    const res = await request(app)
      .post('/api/users/scan')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'INVALID-CODE' });
    expect(res.statusCode).toEqual(404);
  });
});