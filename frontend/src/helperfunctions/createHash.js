import { SHA256 } from 'crypto-js';

export const createHash = (dataArray) => {
    const hash = SHA256(dataArray.join('')).toString();
    return hash;
}