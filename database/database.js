const { Sequelize } = require('sequelize');
const { STATIONS_NAMES } = require('../utils/constants');

const dbUri = process.env.DATABASE_URL || 'sqlite::memory:';

console.log(`Connecting to database at ${dbUri}`);

const sequelize = new Sequelize(dbUri, {
    logging: console.log,
    dialect: 'postgres'
});

const initDb = async () => {
    await sequelize.sync({ logging: true });
}

const seedDb = async (MetroLine, MetroStation) => {
    const existingLines = await MetroLine.count();
    if (existingLines > 0) {
        return;
    }

    const metroLines = [];
    for (let i = 1; i <= 15; i++) {
        metroLines.push({name: `M${i}`});
    }

    await MetroLine.bulkCreate(metroLines);

    const metroStations = [];
    for (let i = 0; i < STATIONS_NAMES.length; i++) {
        metroStations.push({name: STATIONS_NAMES[i], lineId: (i % 15) + 1});
    }
    await MetroStation.bulkCreate(metroStations);

    console.log("Database seeded");
}

module.exports = {sequelize, initDb, seedDb};