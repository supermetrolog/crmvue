import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { captureException } from '@sentry/vue';
import { __DEV__ } from '@/const/const.js';

export const LOCALSTORAGE_PREFIX = 'plr:';
export const LS_USER_KEY = 'user';
export const LS_ACCESS_TOKEN_KEY = 'astn';
export const LS_ACCESS_TOKEN_ID_KEY = 'astnid';

function createKey(str) {
    return LOCALSTORAGE_PREFIX + str;
}

export function getFromLocalstorage(key) {
    if (__DEV__) {
        console.log('[localStorage]', `Get "${key}" key`);
    }

    return localStorage.getItem(createKey(key));
}

export function setInLocalstorage(key, value) {
    localStorage.setItem(createKey(key), value);

    if (__DEV__) {
        console.log('[localStorage]', `Set "${key}" key, value: "${value}"`);
    }
}

export function removeFromLocalstorage(key) {
    localStorage.removeItem(createKey(key));

    if (__DEV__) {
        console.log('[localStorage]', `Remove "${key}" key`);
    }
}

function getUserJSON() {
    return getFromLocalstorage(LS_USER_KEY);
}

function getAccessToken() {
    return getFromLocalstorage(LS_ACCESS_TOKEN_KEY);
}

function getAccessTokenId() {
    return getFromLocalstorage(LS_ACCESS_TOKEN_ID_KEY);
}

export function setUserInLocalStorage(user, token, tokenId) {
    if (user) setInLocalstorage(LS_USER_KEY, JSON.stringify(user));
    if (token) setInLocalstorage(LS_ACCESS_TOKEN_KEY, token);
    if (tokenId) setInLocalstorage(LS_ACCESS_TOKEN_ID_KEY, tokenId);
}

export function removeUserInLocalStorage() {
    removeFromLocalstorage(LS_USER_KEY);
    removeFromLocalstorage(LS_ACCESS_TOKEN_KEY);
    removeFromLocalstorage(LS_ACCESS_TOKEN_ID_KEY);
}

export function getUserFromLocalStorage() {
    const json = getUserJSON();
    try {
        return JSON.parse(json);
    } catch (e) {
        captureException(e);
    }

    return null;
}

export function hasAccessTokenInLocalStorage() {
    return isNotNullish(getAccessToken()) && isNotNullish(getAccessTokenId());
}

export function getAccessTokenFromLocalStorage() {
    return {
        accessToken: getAccessToken(),
        accessTokenId: getAccessTokenId()
    };
}
