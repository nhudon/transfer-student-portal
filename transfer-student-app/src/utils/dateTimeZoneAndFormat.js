
import {DateTime} from 'luxon';

const TIME_ZONE = "America/Los_Angeles";

const dateToDatetimeString = (date) => {
    return DateTime.fromISO(date).setZone(TIME_ZONE).toLocaleString(DateTime.DATETIME_MED);
};

const dateToDateString = (date) => {
    return DateTime.fromISO(date).setZone(TIME_ZONE).toLocaleString(DateTime.DATE_MED);
};

export {dateToDateString, dateToDatetimeString}

