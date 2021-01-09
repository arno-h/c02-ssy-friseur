const express = require('express');
const util = require('../src/util');
const router = express.Router();

// Das Wartezimmer ist eine Liste von Kunden
let wartezimmer = [];

router.get('/', wartezimmerListe);
router.post('/', personHinzufuegen);
router.delete('/next', personLoeschen);


// bei GET wird einfach die gesamte Liste ausgegeben
function wartezimmerListe(req, res) {
    res.json({
        number: wartezimmer.length,
        debug_info: wartezimmer.join(', '),
    });
}

async function personHinzufuegen(req, res) {
    // Die Antwort wird um 10ms verzögert (zu Demozwecken)
    await util.sleep(10);
    wartezimmer.push(req.body.kundenId);
    console.log("Wartezimmer ADD: " + req.body.kundenId);
    res.status(200).end();
}

function personLoeschen(req, res) {
    // Es wird immer die erste Person im Array verwendet.
    // Damit funktioniert das Array wie eine Queue.
    let kunde = wartezimmer.shift();
    console.log("Wartezimmer DEL: " + kunde);
    res.json({kundenId: kunde});
}

module.exports = router;
