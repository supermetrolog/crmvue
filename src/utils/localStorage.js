export const LOCALSTORAGE_PREFIX = 'plr:';
export const LS_USER_KEY = 'user';
export const LS_ACCESS_TOKEN_KEY = 'astn';
export const LS_ACCESS_TOKEN_ID_KEY = 'astnid';

/**
 * Соранить пользователя в localStorage
 * @param {User} user
 * @param {string} token
 * @param {int} tokenId
 */
export function setUserInLocalStorage(user, token, tokenId) {
    if (user) localStorage.setItem(LOCALSTORAGE_PREFIX + LS_USER_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_KEY, token);
    if (tokenId) localStorage.setItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_ID_KEY, tokenId);
}

/**
 * Очистить данные о пользователе из localStorage
 */
export function removeUserInLocalStorage() {
    localStorage.removeItem(LOCALSTORAGE_PREFIX + LS_USER_KEY);
    localStorage.removeItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_ID_KEY);
}

/**
 * Получить пользователя из localStorage
 * @return {User | null} - Вернет пользователя, если он валиден в LS, в ином случае - null
 */
export function getUserFromLocalStorage() {
    const json = localStorage.getItem(LOCALSTORAGE_PREFIX + LS_USER_KEY);
    try {
        return JSON.parse(json);
    } catch (e) {
        // TODO: Create ConsoleLogger
        console.log(e);
    }

    return null;
}

export function getAccessTokenFromLocalStorage() {
    return {
        accessToken: localStorage.getItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_KEY),
        accessTokenId: localStorage.getItem(LOCALSTORAGE_PREFIX + LS_ACCESS_TOKEN_ID_KEY)
    };
}
