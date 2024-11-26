import { waitHash } from '@/utils/helpers/common/waitHash.js';

const hashSet = {};
export function useQueryHash(key) {
    function setHash(query) {
        hashSet[key] = waitHash(query);
        return hashSet[key];
    }

    function confirmHash(query) {
        if (waitHash(query) === hashSet[key]) {
            delete hashSet[key];
            return true;
        }

        return false;
    }

    function confirmTransformedHash(hash) {
        if (hash === hashSet[key]) {
            delete hashSet[key];
            return true;
        }

        return false;
    }

    return { setHash, confirmHash, confirmTransformedHash };
}
