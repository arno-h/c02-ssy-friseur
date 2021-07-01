const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('NodeJS + Express läuft!');
});

module.exports = router;
