import { alg } from '@/utils/alg';

const textFormatter = {
    ucFirst(string, full = false) {
        if (full) return string.replace(/(\s|^)[а-яё]/g, letter => letter.toUpperCase());
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

export const formatterObject = {
    currency(number, leng = 'ru', options = {}) {
        const defaultOptions = {
            style: 'currency',
            currency: 'RUB',
            ...options
        };
        return new Intl.NumberFormat(leng, defaultOptions).format(number);
    },
    number(number, leng = 'ru', options = {}) {
        const defaultOptions = {
            ...options
        };
        return new Intl.NumberFormat(leng, defaultOptions).format(number);
    },
    text() {
        return textFormatter;
    },
    numberRange(range, leng = 'ru', options = {}) {
        const numbers = range.split('-').map(num => num.trim());

        return (
            this.number(numbers[0], leng, options) + ' - ' + this.number(numbers[1], leng, options)
        );
    },
    numberOrRange(value) {
        if (!isNaN(value)) return this.number(value);
        if (value.includes('-')) {
            const splittedValue = value.split('-');
            if (!isNaN(splittedValue[0].trim()) && !isNaN(splittedValue[1].trim()))
                return this.numberRange(value);
        }

        return value;
    },
    numberOrRangeNew(valueMin, valueMax) {
        if (valueMin === valueMax) return this.number(valueMin);
        return this.number(valueMin) + ' - ' + this.number(valueMax);
    },
    formatPhoneNumber(value) {
        let cleaned = ('' + value).replace(/\D/g, '');

        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

        if (match) {
            return `${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
        }

        return null;
    },
    date(value, withTime = false) {
        let options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        if (withTime) options = { ...options, hour: 'numeric', minute: 'numeric' };

        return new Date(value * 1000).toLocaleDateString('ru', options);
    },
    initials(full_name) {
        return full_name
            .split(' ')
            .slice(0, 2)
            .reduce((acc, element) => (acc += element[0] !== '(' ? element[0] : ''), '');
    },
    toCorrectValue(value) {
        if (alg.isNumeric(value)) return this.number(value);
        return value;
    }
};

export const Formatter = {
    install(app) {
        app.config.globalProperties.$formatter = formatterObject;
    }
};
