const Axios = require('axios');
const axios = Axios.create({validateStatus: null});

const lockUrl = 'http://127.0.0.1:3000/wartezimmer/lock';


function sleep(ms) {
    return new Promise(next => setTimeout(next, ms));
}

async function aquireLock() {
    while (true) {
        let response = await axios.put(lockUrl, {lock: true});
        if (response.status === 200) {
            return;
        }
        await sleep(500);  // 500ms warten
    }
}

async function freeLock() {
    await axios.put(lockUrl, {lock: false});
}


module.exports = {
    sleep: sleep,
    aquireLock: aquireLock,
    freeLock: freeLock,
};
