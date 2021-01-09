const express = require('express');
const util = require('../../src/util');
const router = express.Router();

// Das Wartezimmer ist eine Liste von Kunden
let wartezimmer = [];

router.get('/', wartezimmerListe);
router.post('/', personHinzufuegen);
router.delete('/next', personLoeschen);

router.get('/lock', lockStatus);
router.put('/lock', changeLock);

let lock = false;

function lockStatus(req, res) {
    res.json(lock);
}

function changeLock(req, res) {
    /* { "lock": ... } true/false */
    let new_lock = req.body.lock;
    if (new_lock === lock) {    // geht nicht
        res.status(409).json("Lock bereits in angefordertem Status");
    } else {
        lock = new_lock;
        res.status(200).end();
    }
}


// bei GET wird einfach die gesamte Liste ausgegeben
function wartezimmerListe(req, res) {
    res.json({
        number: wartezimmer.length,
        debug_info: wartezimmer.join(', '),
    });
}

async function personHinzufuegen(req, res) {
    // Die Antwort wird um 10ms verzögert (zu Demozwecken)
    await util.sleep(17);
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
