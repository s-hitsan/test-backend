import request from 'supertest';
import { CreateUserModel } from '../../src/models/users';
import { app } from '../../src/app';

describe('/users', () => {
  beforeAll(async () => {
    await request(app).delete('/__test__/data');
  });
  it('should get users array code 200', async () => {
    await request(app).get('/users').expect(200, []);
  });

  it('should return 404 status', async () => {
    await request(app).get('/users/5').expect(404);
  });

  it('should not create user with incorrect data', async () => {
    await request(app).post('/users').send({ name: '' }).expect(400);
    await request(app).get('/users').expect(200, []);
  });

  let user: any = {};
  it('should create user with correct data', async () => {
    const newUser: CreateUserModel = {
      name: 'my name',
      email: 'serhii@gmail.com',
    };
    const response = await request(app).post('/users').send(newUser).expect(201);
    user = response.body;
    expect(user).toEqual({
      _id: expect.any(String),
      id: expect.any(Number),
      name: newUser.name,
      email: newUser.email,
    });
    await request(app).get('/users').expect(200, [user]);
  });

  it(`should update user with correct data`, async () => {
    const response = await request(app)
      .put(`/users/${user.id}`)
      .send({ name: 'Another one' })
      .expect(201);
    await request(app).get('/users').expect(200);
  });

  it(`shouldn't update undefined user`, async () => {
    await request(app).put(`/users/2`).send({ name: 'Another one' }).expect(404);
  });

  it(`should delete user with correct data`, async () => {
    await request(app).delete(`/users/${user.id}`).expect(204);
    await request(app).get('/users').expect(200, []);
  });
});
