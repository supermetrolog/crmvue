import { STATUS_VALIDATION_ERROR } from '@/api/helpers/statuses.js';

export function isValidationError(error) {
    return error.status === STATUS_VALIDATION_ERROR;
}
