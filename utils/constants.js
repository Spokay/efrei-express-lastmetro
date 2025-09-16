const TIMEZONE = process.env.TIMEZONE || 'Europe/Paris';

const SERVICE_HOURS = {
    START_HOUR: 5,
    START_MINUTE: 30,
};

const HEADWAY_MIN = parseInt(process.env.HEADWAY_MIN) || 3;

const LAST_WINDOW_START = process.env.LAST_WINDOW_START || '00:45';

const SERVICE_END = process.env.SERVICE_END || '01:15';

const parseTimeString = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
};

const PARSED_LAST_WINDOW_START = parseTimeString(LAST_WINDOW_START);
const PARSED_SERVICE_END = parseTimeString(SERVICE_END);

const STATIONS_NAMES = [
    "Châtelet",
    "Gare de Lyon",
    "Nation",
    "Bastille",
    "République",
    "Gare du Nord",
    "Montparnasse-Bienvenüe",
    "Saint-Lazare",
    "Opéra",
    "Les Halles",
    "Invalides",
    "Concorde",
    "Trocadéro",
    "Étoile",
    "Porte de Clignancourt",
];

module.exports = {
    TIMEZONE,
    SERVICE_HOURS,
    HEADWAY_MIN,
    LAST_WINDOW_START,
    SERVICE_END,
    STATIONS_NAMES,
    PARSED_LAST_WINDOW_START,
    PARSED_SERVICE_END
};