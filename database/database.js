const { Sequelize } = require('sequelize');
const { STATIONS_NAMES } = require('../utils/constants');

const dbUri = process.env.DATABASE_URL || 'sqlite::memory:';

const sequelize = new Sequelize(dbUri, {
    logging: console.log,
    dialect: 'postgres'
});

const initDb = async () => {
    await sequelize.sync({ logging: true });
}

const seedDb = async (MetroLine, MetroStation, Config) => {
    const existingLines = await MetroLine.count();
    if (existingLines === 0) {
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
        console.log("Metro data seeded");
    }

    const { CONFIG_KEYS } = require('../utils/constants');
    const existingConfig = await Config.count();
    if (existingConfig === 0) {
            const configData = [];

        const defaults = {
        key: CONFIG_KEYS.METRO_DEFAULTS,
        value: JSON.stringify({ line: 'M1', tz: 'Europe/Paris' })
    }

    configData.push(defaults);

    const lastMetroTimes = {};
    STATIONS_NAMES.forEach(stationName => {
        lastMetroTimes[stationName] = '01:15';
    });

    configData.push({
        key: CONFIG_KEYS.METRO_LAST,
        value: JSON.stringify(lastMetroTimes)
    });

        await Config.bulkCreate(configData);
        console.log("Config data seeded");
    }
}

module.exports = {sequelize, initDb, seedDb};