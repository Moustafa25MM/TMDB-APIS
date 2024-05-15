import request from 'supertest';
import { app } from '..';
import { UserRole } from '../types/roles';

describe('Admin Movie Management', () => {
  let token: string;
  let createdMovieId: number;
  const defaultAdmin = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password',
    role: UserRole.ADMIN
  };
  const testMovie = {
    title: 'Test Movie',
    director: 'Test Director',
    year: 2021,
    country: 'Test Country',
    length: 120,
    colour: 'Color',
    genres: [485]
  };

  beforeAll(async () => {

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        username: defaultAdmin.username,
        password: defaultAdmin.password
      });

    expect(loginResponse.status).toBe(200);
    token = loginResponse.body.data.token;
  });

  it('should create a movie', async () => {
    const response = await request(app)
      .post('/admin/create/movie')
      .set('Authorization', `${token}`)
      .send(testMovie);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Movie created successfully');
    createdMovieId = response.body.data.movie.id;
  });

  it('should update the created movie', async () => {
    const updatedMovieInfo = {
      title: 'Updated Test Movie',
      id: createdMovieId
    };

    const response = await request(app)
      .put(`/admin/update/movie`)
      .set('Authorization', `${token}`)
      .send(updatedMovieInfo);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Movie updated successfully');
    expect(response.body.data.movie.title).toBe(updatedMovieInfo.title);
  });

  it('should delete the updated movie', async () => {
    const response = await request(app)
      .delete(`/admin/delete/movie/${createdMovieId}`)
      .set('Authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Movie deleted successfully');
  });
});