const {getNextArrival, getNextArrivals, getStationByName, getSuggestions, getLastMetro} = require("../services/metro-service");

const router = require('express').Router();

router.get('/next-metro', async (req, res) => {
    const stationInput = req.query.station;
    const n = req.query.n ? parseInt(req.query.n) : 1;

    if (!stationInput) {
        return res.status(400).json({error: 'missing station'});
    }

    if (n < 1 || n > 5) {
        return res.status(400).json({error: 'n must be between 1 and 5'});
    }

    const metroStation = await getStationByName(stationInput);

    if (!metroStation) {
        return res.status(404).json({error: 'station not found', suggestion: await getSuggestions(stationInput)});
    }

    if (n === 1) {
        const metroInfo = getNextArrival();

        if (metroInfo.service === 'closed') {
            return res.status(200).json(metroInfo);
        }

        const result = {
            station: metroStation.toJSON(),
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
            station: metroStation.toJSON(),
            arrivals: metroInfoList,
            tz: metroInfoList[0].tz
        };

        return res.status(200).json(result);
    }
});

router.get('/last-metro', async (req, res) => {
    const stationInput = req.query.station;

    if (!stationInput) {
        return res.status(400).json({error: 'missing station'});
    }

    const metroStation = await getStationByName(stationInput);

    if (!metroStation) {
        return res.status(404).json({error: 'station not found', suggestion: await getSuggestions(stationInput)});
    }

    const result = await getLastMetro(stationInput, metroStation);

    if (result.error) {
        return res.status(500).json({error: 'internal error'});
    }

    return res.status(200).json({station: metroStation, lastMetro: result.lastMetro, tz: result.tz});
});

module.exports = router;