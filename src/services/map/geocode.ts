import axios from 'axios';
import { captureException } from '@sentry/vue';
import { responseToData } from '@/api/helpers/responseToData';
import { MemoryCache } from '@/services/memory-cache';

const URL = 'https://geocode-maps.yandex.ru/v1';
const DEFAULT_TIMEOUT = 8000;
const DEFAULT_TTL_MS = 5 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 50;

const DEFAULT_CONFIG = {
    apikey: import.meta.env.VITE_VUE_APP_YANDEX_MAP_KEY,
    lang: 'ru_RU',
    format: 'json',
    sco: 'longlat'
} as const satisfies Omit<GeocodeRequestConfig, 'geocode'>;

type GeocodeKind = 'house' | 'streer' | 'metro' | 'district' | 'locality';

export type GeocodeRequestConfig = {
    apikey: string;
    geocode: string;
    lang: string;
    sco?: 'longlat' | 'latlong';
    kind?: GeocodeKind;
    rspn?: 0 | 1;
    ll?: [number, number];
    spn?: [number, number];
    bbox?: [[number, number], [number, number]];
    format?: string;
    results?: number;
    skip?: number;
    uri?: string;
};

type GeocodeAddressKind =
    | 'house'
    | 'street'
    | 'metro'
    | 'district'
    | 'locality'
    | 'area'
    | 'province'
    | 'country'
    | 'region'
    | 'hydro'
    | 'railway_station'
    | 'station'
    | 'route'
    | 'vegetation'
    | 'airport'
    | 'entrance'
    | 'other';

type GeocodeAddressComponent = {
    kind: GeocodeAddressKind;
    name: string;
};

type GeocodeAddressPrecision = 'exact' | 'number' | 'near' | 'range' | 'street' | 'other';

type GeocodeResponseResultFeatureMember = {
    GeoObject: {
        metaDataProperty: {
            GeocoderMetaData: {
                kind: GeocodeAddressKind;
                text: string;
                precision: GeocodeAddressPrecision;
                Address: {
                    country_code: string;
                    postal_code: string;
                    formatted: string;
                    Components: GeocodeAddressComponent[];
                };
                AddressDetails: {
                    Country: {
                        AddressLine: string;
                        CountryNameCode: string;
                        CountryName: string;
                        AdministrativeArea: {
                            AdministrativeAreaName: string;
                            Locality: {
                                LocalityName: string;
                                Thoroughfare: {
                                    ThoroughfareName: string;
                                    Premise: {
                                        PremiseNumber: string;
                                        PostalCode: {
                                            PostalCodeNumber: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        description?: string;
        name?: string;
        boundedBy: {
            Envelope: {
                lowerCorner: string;
                upperCorner: string;
            };
        };
        Point: {
            pos: string;
        };
    };
};

export type GeocodeResponseResult = {
    response: {
        GeoObjectCollection: {
            metaDataProperty: {
                GeocoderResponseMetaData: {
                    request?: string;
                    fix?: string;
                    suggest?: string;
                    found?: string;
                    results?: string;
                    skip?: string;
                };
            };
            featureMember: GeocodeResponseResultFeatureMember[];
        };
    };
};

export type AddressSuggestion = {
    id: string;
    label: string;
    description: string;
    value: string;
    kind?: string;
    precision?: string;
    coords: [number, number]; // [lat, lon]
    components: { kind: string; name: string }[];
    raw: any;
};

const client = {
    async get(config: GeocodeRequestConfig) {
        return await axios.get<GeocodeResponseResult>(URL, {
            params: config,
            timeout: DEFAULT_TIMEOUT
        });
    }
};

const cache = new MemoryCache<Promise<AddressSuggestion[]> | AddressSuggestion[]>({
    ttlMs: DEFAULT_TTL_MS,
    maxEntries: DEFAULT_MAX_ENTRIES
});

function buildCacheKey(query: string, config: Partial<GeocodeRequestConfig> = {}): string {
    if (Object.keys(config).length > 0) {
        return `${query}-${JSON.stringify(config)}`;
    }

    return query;
}

export async function findAddressByText(
    query?: string,
    config: Partial<GeocodeRequestConfig & { groupByCountry: boolean }> = {}
) {
    if (!query || query?.length === 0) {
        return [];
    }

    const preparedConfig = {
        ...DEFAULT_CONFIG,
        geocode: query,
        ...config
    };

    const key = buildCacheKey(query, config);
    const cached = cache.get(key);

    if (cached) {
        return cached;
    }

    const promise = executeRequestAndNormalize(preparedConfig, key);

    cache.set(key, promise);

    return promise;
}

async function executeRequestAndNormalize(config: GeocodeRequestConfig, cacheKey: string) {
    try {
        const response = await client.get(config);

        const normalized = normalizeResponse(responseToData(response), config.sco!);

        cache.set(cacheKey, normalized);

        return normalized;
    } catch (err: any) {
        cache.delete(cacheKey);
        captureException(err);

        return [];
    }
}

function normalizeResponse(
    response: GeocodeResponseResult,
    sco: 'longlat' | 'latlong'
): AddressSuggestion[] {
    const data = response?.response;

    if (
        !data?.GeoObjectCollection?.featureMember ||
        !Array.isArray(data.GeoObjectCollection.featureMember)
    ) {
        return [];
    }

    return data.GeoObjectCollection.featureMember.map((fm, idx: number) => {
        const geo = fm.GeoObject;
        const meta = geo?.metaDataProperty?.GeocoderMetaData ?? {};
        const address = meta?.Address ?? {};
        const formatted = geo?.name ?? meta?.text ?? address?.formatted ?? '';
        const description = address?.formatted ?? '';
        const kind = meta?.kind;
        const precision = meta?.precision;

        const posRaw: string | undefined = geo?.Point?.pos;

        const coords: [number, number] = posRaw
            ? (() => {
                  const parts = posRaw.trim().split(/\s+/).map(Number);

                  if (parts.length >= 2) {
                      const [a, b] = parts;
                      if (sco === 'latlong') return [a, b];
                      return [b, a];
                  }

                  return [0, 0];
              })()
            : [0, 0];

        const components = (address?.Components ?? []).map(component => ({
            kind: component.kind,
            name: component.name
        }));

        const id = data.GeoObjectCollection?.metaDataProperty?.GeocoderResponseMetaData?.request
            ? `${data.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.request}-${idx}`
            : `${formatted}-${idx}`;

        return {
            id,
            label: formatted,
            value: meta?.text,
            description,
            kind,
            precision,
            coords,
            components,
            raw: geo
        } as AddressSuggestion;
    });
}
