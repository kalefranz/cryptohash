const MINE_RATE = 1 * 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: 1,
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY,
    lastHash: '-----',
    data: [],
    hash: 'hash-one',
};

module.exports = {
    GENESIS_DATA,
    MINE_RATE,
};
