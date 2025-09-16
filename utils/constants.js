const TIMEZONE = process.env.TIMEZONE || 'Europe/Paris';

const SERVICE_HOURS = {
    START_HOUR: 5,
    START_MINUTE: 30,
    END_HOUR: 1,
    END_MINUTE: 15,
    LAST_METRO_START_HOUR: 0,
    LAST_METRO_START_MINUTE: 45
};

module.exports = { TIMEZONE, SERVICE_HOURS };