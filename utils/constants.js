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
    "Gare Montparnasse",
    "Gare de l'Est",
    "Gare Saint-Lazare",
    "Gare d'Austerlitz",
    "Nation",
    "Bastille",
    "République",
    "Montparnasse-Bienvenüe",
    "Opéra",
    "Les Halles",
    "Invalides",
    "Concorde",
    "Trocadéro",
    "Étoile",
    "Porte de Vincennes",
    "Porte de la Chapelle",
    "Porte d'Orléans",
    "Porte de Saint-Cloud",
    "Porte d'Italie",
    "Porte de Clichy",
    "Porte Maillot",
    "Porte de Bagnolet",
    "Porte des Lilas",
    "Porte de Montreuil",
    "Porte d'Auteuil",
    "Porte de Vanves",
    "Porte de Charenton",
    "Porte de Pantin",
    "Porte de Choisy",
    "Porte d'Ivry",
    "Porte de Clignancourt",
    "Château de Vincennes",
    "Château Rouge",
    "Château d'Eau",
    "Château Landon",
    "Château de Bagnolet",
    "Château de la Reine",
    "Château de Fontainebleau",
    "Château de Sceaux",
    "Château de Versailles",
    "Château de Chantilly",
    "Château de Compiègne"
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