/**
 *
 * @param {object} response
 * @param {number} status
 * @return {?boolean} Returns `true` if response status equals to `status` parameter, `null` if response has error
 */
export function responseHasStatus(response, status) {
    if (response == null) return null;
    return response.status === status;
}
