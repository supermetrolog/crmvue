export type RequestQueryParams = Record<RequestQueryParamsKey, RequestQueryParamsValue>;

export type RequestQueryParamsKey = string;

export type RequestQueryParamsValue<T = string | number | boolean | undefined | null> = T | T[];
