const { TIMEZONE, SERVICE_HOURS, STATIONS_NAMES, HEADWAY_MIN, PARSED_LAST_WINDOW_START, PARSED_SERVICE_END } = require("../utils/constants");

const getNextArrival = (currentTime = new Date(), headwayMin = HEADWAY_MIN) => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (!isServiceOpen(currentHour, currentMinute)) {
        return { service: 'closed', tz: TIMEZONE };
    }

    const nextMetroTime = new Date(currentTime.getTime() + headwayMin * 60 * 1000);
    const nextHour = nextMetroTime.getHours();
    const nextMinute = nextMetroTime.getMinutes();

    if (isAfterServiceEnd(nextHour, nextMinute)) {
        return { service: 'closed', tz: TIMEZONE };
    }

    return {
        nextArrival: formatTimeAsHHMM(nextMetroTime),
        isLast: isInLastMetroWindow(currentHour, currentMinute),
        headwayMin,
        tz: TIMEZONE
    };
};

const getNextArrivals = (n, currentTime = new Date(), headwayMin = HEADWAY_MIN) => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (!isServiceOpen(currentHour, currentMinute)) {
        return { service: 'closed', tz: TIMEZONE };
    }

    const arrivals = [];
    let tempTime = new Date(currentTime);

    for (let i = 0; i < n; i++) {
        const nextMetroTime = new Date(tempTime.getTime() + headwayMin * 60 * 1000);
        const nextHour = nextMetroTime.getHours();
        const nextMinute = nextMetroTime.getMinutes();

        if (isAfterServiceEnd(nextHour, nextMinute)) {
            break;
        }

        arrivals.push({
            nextArrival: formatTimeAsHHMM(nextMetroTime),
            isLast: isInLastMetroWindow(nextHour, nextMinute),
            headwayMin,
            tz: TIMEZONE
        });

        tempTime = nextMetroTime;
    }

    return arrivals;
};

const getSuggestion = (input) => {
    return STATIONS_NAMES.filter(station => {
        const sanitizedInput = removeAccents(input.trim().toLowerCase());
        const sanitizedStation = removeAccents(station.trim().toLowerCase())
        // remove accents for comparison
        return sanitizedStation.includes(sanitizedInput);
    })
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const formatTimeAsHHMM = (date) => {
    return String(date.getHours()).padStart(2, '0') + ':' +
           String(date.getMinutes()).padStart(2, '0');
};

const isServiceOpen = (hour, minute) => {
    return isInMorningServiceHours(hour, minute) ||
           isInEveningServiceHours(hour, minute) ||
           isInLateNightServiceHours(hour, minute);
};

const isInMorningServiceHours = (hour, minute) => {
    return hour > SERVICE_HOURS.START_HOUR ||
           (hour === SERVICE_HOURS.START_HOUR && minute >= SERVICE_HOURS.START_MINUTE);
};

const isInEveningServiceHours = (hour, minute) => {
    return hour === 0;
};

const isInLateNightServiceHours = (hour, minute) => {
    return hour === PARSED_SERVICE_END.hours && minute <= PARSED_SERVICE_END.minutes;
};

const isInLastMetroWindow = (hour, minute) => {
    return (hour === PARSED_LAST_WINDOW_START.hours &&
            minute >= PARSED_LAST_WINDOW_START.minutes) ||
           (hour === PARSED_SERVICE_END.hours &&
            minute <= PARSED_SERVICE_END.minutes);
};

const isAfterServiceEnd = (hour, minute) => {
    return (hour === PARSED_SERVICE_END.hours && minute > PARSED_SERVICE_END.minutes) ||
           (hour > PARSED_SERVICE_END.hours && hour < SERVICE_HOURS.START_HOUR) ||
           (hour === SERVICE_HOURS.START_HOUR && minute < SERVICE_HOURS.START_MINUTE);
};

module.exports = { getNextArrival, getNextArrivals, getSuggestion};