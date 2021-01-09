const Axios = require('axios');
const axios = Axios.create({validateStatus: null});
const util = require('../src/util');
const FriseurStatus = require('../services/friseur/status');

const hostUrl = "http://127.0.0.1:3000";

async function kunde(kundenId) {
    kundenId = "kunde-" + kundenId;
    console.log("Meine Kunden-ID ist " + kundenId);

    await util.aquireLock();

    // Anschauen was der Friseur macht
    let response = await axios.get(hostUrl + '/friseur');
    // -Ausgabe des Friseurs
    let friseur = response.data;
    console.log(kundenId +
                ": Friseur angetroffen im Status: " + friseur.status +
                " mit Kunde " + friseur.kunde);

    if (friseur.status === FriseurStatus.schlafend) {
        // Friseur aufwecken
        response = await axios.post(hostUrl + '/friseur/neuerKunde', {kundenId: kundenId});
        // zur Nachverfolgung die Antwort des Friseurs ausgeben
        console.log(kundenId + ": Antwort auf Aufwecken: " + response.data);
    }
    else {
        // ins Wartezimmer gehen
        await util.sleep(200);  // zu Demozwecken um 200ms verzögern
        response = await axios.post(hostUrl + '/wartezimmer', {kundenId: kundenId});
        // zur Nachverfolgung die Antwort des Wartezimmers ausgeben
        console.log(kundenId + ": Antwort von Wartezimmer: " + response.status);
    }

    await util.freeLock();
}


// Basisfall: nur 1 Kunde
kunde(1234).then();


// Mehrere Kunden
async function vieleKunden() {
    const anzahl = 10;
    const wartezeitZwischenNeuenKunden = 50;

    for (let kundenId=1; kundenId <= anzahl; kundenId++) {
        kunde(kundenId).then(); // nicht auf Ergebnis mit "await" warten => starten parallel
        await util.sleep(wartezeitZwischenNeuenKunden);
    }
}

// Zum Starten:
// vieleKunden().then();
