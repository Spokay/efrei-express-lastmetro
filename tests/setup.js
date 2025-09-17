// Test setup file
require('dotenv').config({ path: '.env.test' });

jest.mock('../database/database', () => ({
  sequelize: {
    sync: jest.fn().mockResolvedValue(),
    query: jest.fn(),
    define: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      bulkCreate: jest.fn(),
      belongsTo: jest.fn(),
      hasMany: jest.fn()
    })
  },
  initDb: jest.fn().mockResolvedValue(),
  seedDb: jest.fn().mockResolvedValue()
}));

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};

jest.setTimeout(10000);