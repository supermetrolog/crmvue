import { helpers } from '@vuelidate/validators';
export const onlyPattern = pattern => helpers.regex(pattern);

export const onlyEnglish = onlyPattern(/^[a-zA-Z\s\d"'@.,-]*$/g);
export const onlyRussian = onlyPattern(/^[а-яА-ЯёЁ\s\d"'@.,-]*$/g);
export const every = validator => value => {
    return value.every(element =>
        validator.$validator ? validator.$validator(element) : validator(element)
    );
};

export const everyProperty = (validator, property) => value => {
    return value.every(element =>
        validator.$validator
            ? validator.$validator(element[property])
            : validator(element[property])
    );
};

export const any = validator => value => {
    return value.some(element =>
        validator.$validator ? validator.$validator(element) : validator(element)
    );
};

export const anyProperty = (validator, property) => value => {
    return value.some(element =>
        validator.$validator
            ? validator.$validator(element[property])
            : validator(element[property])
    );
};

export const anyHasProperty = (property, _value) => value => {
    return value.some(element => element[property] === _value);
};

export const empty = value => {
    return value === null || value === '' || value === undefined;
};

export const emptyWithProperty = property => value => {
    return !value.length || (value.length === 1 && !value[0][property].length);
};

export const max = value => _value => {
    return empty(value) || empty(_value) || Number(_value) <= Number(value);
};

export const min = value => _value => {
    return empty(value) || empty(_value) || Number(_value) >= Number(value);
};

export const maxDate = dateLimit => date => {
    return empty(dateLimit) || empty(date) || new Date(date) <= new Date(dateLimit);
};

export const onlyPositiveNumber = (message = 'Некорректное отрицательное значение') =>
    helpers.withMessage(message, min(0));

export const validateUrl = value => {
    const with_protocol_regex = new RegExp(
        '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
    );
    const regex = new RegExp('^([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?');
    return regex.test(value) || with_protocol_regex.test(value);
};

export const validateEmail = value => {
    return String(value)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validatePhone = value => {
    return value.length > 17 && value.length < 21;
};
