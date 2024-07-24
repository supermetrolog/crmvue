import { waitHash } from '@/utils/index.js';

const hashSet = {};
export function useQueryHash(key) {
    function setHash(query) {
        hashSet[key] = waitHash(query);
    }

    function confirmHash(query) {
        if (waitHash(query) === hashSet[key]) {
            delete hashSet[key];
            return true;
        }

        return false;
    }

    return { setHash, confirmHash };
}
