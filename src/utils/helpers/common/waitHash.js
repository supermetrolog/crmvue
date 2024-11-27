import sha256 from 'crypto-js/sha256.js';

export function waitHash(data) {
    return sha256(JSON.stringify(data)).toString();
}
