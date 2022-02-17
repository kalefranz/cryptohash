const cryptoHash = require('./crypto-hash');
const hexToBinary = require('hex-to-binary');

const { GENESIS_DATA, MINE_RATE } = require('./config');


class Block {
    constructor({ timestamp, nonce, difficulty, lastHash, data, hash }) {
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.lastHash = lastHash;
        this.data = data;
        this.hash = hash;
    }

    static genesis() {
        return new this(GENESIS_DATA);
    };

    static mineBlock({ lastBlock, data }) {
        const lastHash = lastBlock.hash;
        
        let hash, nonce, timestamp, difficulty;
        for (nonce=0; ; nonce++) {
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, nonce, difficulty, lastHash, data)
            if (hexToBinary(hash).substring(0, difficulty) === '0'.repeat(difficulty)) {
                break;
            }
        }

        return new this({
            timestamp,
            nonce,
            difficulty,
            lastHash,
            data,
            hash,
        });
    };

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if (difficulty < 1) return 1;
        const difference = timestamp - originalBlock.timestamp;
        if (difference > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    }

    calculateHash() {
        return cryptoHash(
            this.timestamp, 
            this.nonce,
            this.difficulty,
            this.lastHash,
            this.data
        );
    }

    isEqualTo(otherBlock) {
        return JSON.stringify(this) === JSON.stringify(otherBlock);
    }

    hasValidHash(correctLastHash) {
        return this.lastHash === correctLastHash && this.hash === this.calculateHash();
    }
    
}

module.exports = Block;
