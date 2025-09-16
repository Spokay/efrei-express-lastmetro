const {getNextArrival} = require("../services/metro-service");

const router = require('express').Router();

router.get('/next-metro', (req, res) => {
    const station = req.query.station;

    if (!station) {
        return res.status(400).json({ error: 'missing station' });
    }

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
});

module.exports = router;