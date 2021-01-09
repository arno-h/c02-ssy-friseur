function sleep(ms) {
    return new Promise(next => setTimeout(next, ms));
}

module.exports = {
    sleep: sleep,
};
