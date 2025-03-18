import { sha256 } from 'js-sha256';

export function waitHash(data) {
    return sha256(JSON.stringify(data)).toString();
}
