import { LOCALSTORAGE_PREFIX } from '@/services/localStorage';
import { TourID } from '@/composables/useTour/useTour';
import { isNullish } from '@/utils/helpers/common/isNullish';

const CACHE_TIMEOUT = 3 * 24 * 60 * 60 * 1000; // 3 days
const CACHE_PREFIX = 'tour';
const CACHE_PROVIDER = localStorage;

export type TourCache = number;

function generateTourCacheKey(tourId: TourID): string {
    return `${LOCALSTORAGE_PREFIX}${CACHE_PREFIX}-${tourId}`;
}

export function getTourFromCache(tourId: TourID): TourCache | null {
    const cacheKey = generateTourCacheKey(tourId);

    const data = CACHE_PROVIDER.getItem(cacheKey);

    if (isNullish(data)) {
        return null;
    }

    if (Date.now() - Number(data) > CACHE_TIMEOUT) {
        return null;
    }

    return Number(data);
}

export function saveTourToCache(tourId: TourID) {
    const cacheKey = generateTourCacheKey(tourId);

    CACHE_PROVIDER.setItem(cacheKey, Date.now().toString());
}
