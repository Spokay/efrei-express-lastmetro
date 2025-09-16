const { TIMEZONE, SERVICE_HOURS } = require("../utils/constants");

const getNextArrival = (currentTime = new Date(), headwayMin = 3) => {
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
    return hour === SERVICE_HOURS.END_HOUR && minute <= SERVICE_HOURS.END_MINUTE;
};

const isInLastMetroWindow = (hour, minute) => {
    return (hour === SERVICE_HOURS.LAST_METRO_START_HOUR &&
            minute >= SERVICE_HOURS.LAST_METRO_START_MINUTE) ||
           (hour === SERVICE_HOURS.END_HOUR &&
            minute <= SERVICE_HOURS.END_MINUTE);
};

const isAfterServiceEnd = (hour, minute) => {
    return (hour === SERVICE_HOURS.END_HOUR && minute > SERVICE_HOURS.END_MINUTE) ||
           (hour > SERVICE_HOURS.END_HOUR && hour < SERVICE_HOURS.START_HOUR) ||
           (hour === SERVICE_HOURS.START_HOUR && minute < SERVICE_HOURS.START_MINUTE);
};

module.exports = { getNextArrival };