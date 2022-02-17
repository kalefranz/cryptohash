const Block = require('./block');
const cryptoHash = require('../util/crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    };

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data,
        });
        this.chain.push(newBlock);
    };

    static isValidChain(chain) {
        if (chain.length === 0) return false;
        if (!Block.genesis().isEqualTo(chain[0])) return false;
        if (chain.length === 1) return true;

        for (let q=1; q<=chain.length-1; q++) {
            if (!chain[q].hasValidHash(chain[q-1].hash)) return false;
            if (Math.abs(chain[q-1].difficulty - chain[q].difficulty) > 1) return false;
        }
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return false;
        }
        const newBlockchain = newChain.map(block => {
            if (block instanceof Block) {
                return block;
            } else {
                return new Block(block);
            }
        });
        if (!Blockchain.isValidChain(newBlockchain)) {
            console.error('The incoming chain must be valid');
            return false;
        }
        console.log('replacing chain with', newChain);
        this.chain = newBlockchain;
        return true;
    }
}


module.exports = Blockchain
