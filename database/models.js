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

MetroStation.belongsTo(MetroLine, { foreignKey: 'lineId', as: 'line' });
MetroLine.hasMany(MetroStation, { foreignKey: 'lineId' });


module.exports = {
    MetroLine,
    MetroStation
}