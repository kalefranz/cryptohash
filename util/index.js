const crypto = require('crypto');
const EC = require('elliptic').ec;


const ec = new EC('secp256k1');


const verifySignature = ({ publicKey, data, signature }) => {
    const key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(cryptoHash(data), signature);
}


const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.sort().join(''));
    return hash.digest('hex');
};


module.exports = { ec, verifySignature, cryptoHash };
