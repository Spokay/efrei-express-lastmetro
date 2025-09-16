const {getNextArrival, getNextArrivals, getSuggestion} = require("../services/metro-service");

const router = require('express').Router();
const { STATIONS_NAMES } = require("../utils/constants");

router.get('/next-metro', (req, res) => {
    const station = req.query.station;
    const n = parseInt(req.query.n) || 1;

    if (!station) {
        return res.status(400).json({ error: 'missing station' });
    }

    if (n < 1 || n > 5) {
        return res.status(400).json({ error: 'n must be between 1 and 5' });
    }

    if (!STATIONS_NAMES.includes(station)) {
        return res.status(404).json({ error: 'station not found', suggestion: getSuggestion(station) });
    }

    if (n === 1) {
        const metroInfo = getNextArrival();

        if (metroInfo.service === 'closed') {
            return res.status(200).json(metroInfo);
        }

        const result = {
            station: station,
            line: "M7",
            headwayMin: metroInfo.headwayMin,
            nextArrival: metroInfo.nextArrival,
            isLast: metroInfo.isLast,
            tz: metroInfo.tz
        };

        return res.status(200).json(result);
    } else {
        const metroInfoList = getNextArrivals(n);

        if (metroInfoList.service === 'closed') {
            return res.status(200).json(metroInfoList);
        }

        const result = {
            station: station,
            line: "M7",
            arrivals: metroInfoList,
            tz: metroInfoList[0].tz
        };

        return res.status(200).json(result);
    }
});

module.exports = router;