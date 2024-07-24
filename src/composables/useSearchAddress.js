import { yandexmap } from '@/utils/yandexMap.js';

export function useSearchAddress(address = null) {
    return async function searchAddress(querySearch) {
        if (address.value) return await yandexmap.getAddress(querySearch, address.value);
        return await yandexmap.getAddress(querySearch);
    };
}
