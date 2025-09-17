const {DataTypes} = require('sequelize');
const {sequelize} = require('./database');

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

MetroStation.belongsTo(MetroLine, { foreignKey: 'lineId', as: 'line' });
MetroLine.hasMany(MetroStation, { foreignKey: 'lineId' });


module.exports = {
    MetroLine,
    MetroStation,
    Config
}