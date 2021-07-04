const express = require('express');
const Axios = require('axios');
const axios = Axios.create({validateStatus: null});
const FriseurStatus = require('./status');
const util = require('../../src/util');
const router = express.Router();

const dauerHaareSchneiden = 20; // Zeit in ms

// Im Friseur-Objekt merken wir uns den Status des Friseurs
// und (falls gerade vorhanden) welcher Kunde gerade bearbeitet wird.
let friseur = {
    status: FriseurStatus.schlafend,
    kunde: null
};

/* Routen */
router.get('/', zeigeFriseur);
router.post('/neuerKunde', aktualisiereFriseur);

function zeigeFriseur(req, res) {
    res.json(friseur);
}

// Funktion wird genützt, um neue Friseurdaten zu setzen
function aktualisiereFriseur(req, res) {
    /* { "kundenId": ... } */
    friseur.status = FriseurStatus.schneidend;
    friseur.kunde = req.body.kundenId;

    console.log("Schneide Haare bei " + friseur.kunde);

    // nach einiger Zeit geht es weiter bei der Funktion haareFertigGeschnitten
    setTimeout(haareFertigGeschnitten, dauerHaareSchneiden);
    res.status(200).end();
}

async function haareFertigGeschnitten() {
    console.log("Fertig! ... und ab mit dir " + friseur.kunde);
    friseur.kunde = null;

    // Testen ob schlafen erlaubt
    // type coercion -- truthy & falsy values     "" == false, [] == false, 0 == false
    while (schlafen_gesperrt === true) {
        // busy-loop verhindern: zwischendurch immer wieder sleep aufrufen
        await util.sleep(5);
    }

    // Schauen wir im Wartezimmer nach, ob jemand da ist
    console.log("Sehe im Wartezimmer nach");
    let resp = await axios.get('http://127.0.0.1:3000/wartezimmer/');
    console.log(resp.data);

    if (resp.data.number === 0) {
        // Niemand da --> Friseur legt sich schlafen
        friseur.status = FriseurStatus.schlafend;
        console.log("Niemand da - ich lege mich schlafen.");
        return;
    }

    // Jemand im Wartezimmer: Friseur nimmt den nächsten Kunden ran
    resp = await axios.delete('http://127.0.0.1:3000/wartezimmer/next');
    friseur.kunde = resp.data.kundenId;
    console.log('Neuen Kunden gefunden: ' + friseur.kunde);
    // nach einiger Zeit geht es wieder von vorne los
    setTimeout(haareFertigGeschnitten, dauerHaareSchneiden);
}

let schlafen_gesperrt = false;

router.put('/schlaf-lock', putSleepLock);
/*
  { "lock":  true/false }
 */
function putSleepLock(req, res) {
    // Four cases we need to handle:
    // client(PUT)      lock(current)
    // true             false      << expected case when locking
    // false            true       << expected case when unlocking
    // true             true       << try to lock already locked service
    // false            false      << try to unlock already unlocked service

    if (req.body.lock === true && schlafen_gesperrt === false) {
        schlafen_gesperrt = true;
        res.status(200).end();
    }
    else if (req.body.lock === false && schlafen_gesperrt === true) {
        schlafen_gesperrt = false;
        res.status(200).end();
    }
    else if (req.body.lock === true && schlafen_gesperrt === true) {
        res.status(409).end();  // 409 Conflict
    }
    else if (req.body.lock === false && schlafen_gesperrt === false) {
        res.status(409).end();  // 409 Conflict
    }
}

module.exports = router;
