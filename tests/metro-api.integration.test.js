const request = require('supertest');
const express = require('express');
const { initTestDb, closeTestDb, MetroLine, MetroStation, Config } = require('./test-database');

// Mock the real database models with our test models
jest.mock('../database/models', () => require('./test-database'));

const metroRoutes = require('../routes/metro-routes');
const healthRoutes = require('../routes/health-routes');

// Create test app
const app = express();
app.use(express.json());
app.use('/metro', metroRoutes);
app.use('/health', healthRoutes);

describe('Metro API Integration Tests', () => {
  beforeAll(async () => {
    await initTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  describe('GET /metro/next-metro', () => {
    it('should return metro info for existing station', async () => {
      const response = await request(app)
        .get('/metro/next-metro')
        .query({ station: 'Chatelet' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('station');
      expect(response.body.station).toHaveProperty('name', 'Chatelet');
      expect(response.body.station).toHaveProperty('line');
      expect(response.body).toHaveProperty('nextArrival');
      expect(response.body).toHaveProperty('tz', 'Europe/Paris');
    });

    it('should return 404 with suggestions with the pattern', async () => {
      const response = await request(app)
        .get('/metro/next-metro')
        .query({ station: 'NonExistent' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'station not found');
      expect(response.body).toHaveProperty('suggestion');
      expect(Array.isArray(response.body.suggestion)).toBe(true);
    });

    it('should return 400 for missing station parameter', async () => {
      const response = await request(app)
        .get('/metro/next-metro');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'missing station' });
    });

    it('should validate n parameter range', async () => {
      const response = await request(app)
        .get('/metro/next-metro')
        .query({ station: 'Chatelet', n: '10' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'n must be between 1 and 5' });
    });
  });

  describe('GET /metro/last-metro', () => {
    it('should return last metro info for existing station', async () => {
      const response = await request(app)
        .get('/metro/last-metro')
        .query({ station: 'Chatelet' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('station');
      expect(response.body).toHaveProperty('lastMetro');
      expect(response.body.station).toHaveProperty('line');
      expect(response.body).toHaveProperty('tz', 'Europe/Paris');
      expect(typeof response.body.lastMetro).toBe('string');
      expect(response.body.lastMetro).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should return 404 for unknown station', async () => {
      const response = await request(app)
        .get('/metro/last-metro')
        .query({ station: 'NonExistentStation' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'station not found');
      expect(response.body).toHaveProperty('suggestion');
    });

    it('should return 400 for missing station parameter', async () => {
      const response = await request(app)
        .get('/metro/last-metro');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'missing station' });
    });
  });

  describe('Next arrival time format validation', () => {
    it('should return nextArrival in HH:MM format', async () => {
      const response = await request(app)
        .get('/metro/next-metro')
        .query({ station: 'Chatelet' });

      expect(response.status).toBe(200);
      if (response.body.service !== 'closed') {
        expect(response.body).toHaveProperty('nextArrival');
        expect(response.body.nextArrival).toMatch(/^\d{2}:\d{2}$/);
      }
    });
  });
});