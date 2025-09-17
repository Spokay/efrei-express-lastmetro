const { Sequelize, DataTypes } = require('sequelize');
const { STATIONS_NAMES } = require('../utils/constants');

// Create in-memory SQLite database for testing
const sequelize = new Sequelize('sqlite::memory:', {
  logging: false, // Disable logging for cleaner test output
  dialect: 'sqlite'
});

// Define models for testing
const MetroLine = sequelize.define('MetroLine', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
});

const MetroStation = sequelize.define('MetroStation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  lineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MetroLine,
      key: 'id'
    }
  }
});

const Config = sequelize.define('Config', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Set up associations
MetroStation.belongsTo(MetroLine, { foreignKey: 'lineId', as: 'line' });
MetroLine.hasMany(MetroStation, { foreignKey: 'lineId' });

const initTestDb = async () => {
  await sequelize.sync({ force: true });

  // Seed test data
  const metroLines = [];
  for (let i = 1; i <= 15; i++) {
    metroLines.push({ name: `M${i}` });
  }
  await MetroLine.bulkCreate(metroLines);

  const metroStations = [];
  for (let i = 0; i < Math.min(10, STATIONS_NAMES.length); i++) { // Only create 10 stations for testing
    metroStations.push({
      name: STATIONS_NAMES[i],
      lineId: (i % 15) + 1
    });
  }
  await MetroStation.bulkCreate(metroStations);

  // Seed config data
  const { CONFIG_KEYS } = require('../utils/constants');
  const configData = [
    {
      key: CONFIG_KEYS.METRO_DEFAULTS,
      value: JSON.stringify({ line: 'M1', tz: 'Europe/Paris' })
    }
  ];

  // Create metro.last config with last metro times for test stations
  const lastMetroTimes = {};
  for (let i = 0; i < Math.min(10, STATIONS_NAMES.length); i++) {
    lastMetroTimes[STATIONS_NAMES[i]] = '01:15'; // Default last metro time
  }

  configData.push({
    key: CONFIG_KEYS.METRO_LAST,
    value: JSON.stringify(lastMetroTimes)
  });

  await Config.bulkCreate(configData);
};

const closeTestDb = async () => {
  await sequelize.close();
};

module.exports = {
  sequelize,
  MetroLine,
  MetroStation,
  Config,
  initTestDb,
  closeTestDb
};