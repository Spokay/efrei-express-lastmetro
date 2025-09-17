const {getNextArrival, getNextArrivals, getStationByName, getSuggestions} = require("../services/metro-service");

const router = require('express').Router();

router.get('/next-metro', async (req, res) => {
    const stationInput = req.query.station;
    const n = parseInt(req.query.n) || 1;

    if (!stationInput) {
        return res.status(400).json({error: 'missing station'});
    }

    if (n < 1 || n > 5) {
        return res.status(400).json({error: 'n must be between 1 and 5'});
    }

    const metroStation = await getStationByName(stationInput);
    console.log(`Requested station: ${stationInput}, Found: ${metroStation}`);

    if (!metroStation) {
        return res.status(404).json({error: 'station not found', suggestion: await getSuggestions(stationInput)});
    }

    if (n === 1) {
        const metroInfo = getNextArrival();

        if (metroInfo.service === 'closed') {
            console.log('Service is closed');
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

module.exports = router;