const { getNextArrival } = require('../services/metro-service');

jest.mock('../database/models', () => ({
  MetroStation: {
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  MetroLine: {
    findAll: jest.fn()
  }
}));

const { MetroStation } = require('../database/models');

describe('Metro Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNextArrival', () => {
    it('should return next arrival during service hours', () => {
      const mockTime = new Date('2025-01-01T10:00:00.000Z');

      const result = getNextArrival(mockTime);

      expect(result).toHaveProperty('nextArrival');
      expect(result).toHaveProperty('isLast');
      expect(result).toHaveProperty('headwayMin', 3);
      expect(result).toHaveProperty('tz', 'Europe/Paris');
    });

    it('should return closed service outside service hours', () => {
      const mockTime = new Date('2025-01-01T03:00:00.000Z');

      const result = getNextArrival(mockTime);

      expect(result).toEqual({
        service: 'closed',
        tz: 'Europe/Paris'
      });
    });

    it('should calculate next arrival with 3 minute headway in HH:MM format', () => {
      const mockTime = new Date('2025-01-01T13:22:00.000Z'); // 13:22 UTC = 14:22 Paris time

      const result = getNextArrival(mockTime, 3);

      expect(result).toHaveProperty('nextArrival', '14:25');
      expect(result).toHaveProperty('headwayMin', 3);
      expect(result).toHaveProperty('tz', 'Europe/Paris');
    });

    it('should use default headway of 3 minutes when not specified', () => {
      const mockTime = new Date('2025-01-01T13:22:00.000Z');

      const resultWithDefault = getNextArrival(mockTime);
      const resultWithExplicit = getNextArrival(mockTime, 3);

      expect(resultWithDefault.nextArrival).toBe(resultWithExplicit.nextArrival);
      expect(resultWithDefault.headwayMin).toBe(3);
    });
  });
});