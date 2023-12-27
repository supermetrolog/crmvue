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

        return this.number(numbers[0], leng, options) + ' - ' + this.number(numbers[1], leng, options);
    },
    numberOrRange(value) {
        if (!isNaN(value)) return this.number(value);
        if (value.includes('-')) {
            const splittedValue = value.split('-');
            if (!isNaN(splittedValue[0].trim()) && !isNaN(splittedValue[1].trim())) return this.numberRange(value);
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
    date(value) {
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        return new Date(value * 1000).toLocaleDateString('ru', options);
    },
    initials(full_name) {
        return full_name
            .split(' ')
            .slice(0, 2)
            .reduce((acc, element) => (acc += element[0] !== '(' ? element[0] : ''), '');
    }
};

export const apiUrlHelperObject = {
    url() {
        let host = window.location.host;

        if (host === process.env.VUE_APP_RESERVE_HOST) {
            return process.env.VUE_APP_RESERVE_API_URL;
        }

        return process.env.VUE_APP_API_URL;
    },
    objectsUrl() {
        return process.env.VUE_APP_OBJECT_URL;
    },
    uploadsUrl() {
        return process.env.VUE_APP_SERVER + process.env.VUE_APP_UPLOADS_PATH;
    },
    imagesUrl() {
        return process.env.VUE_APP_API_URL + process.env.VUE_APP_IMAGES_PATH;
    },
    fileNotFoundUrl() {
        return this.imagesUrl() + process.env.VUE_APP_NOT_FOUND_FILENAME;
    },
    getImageUrl(imageName) {
        return this.imagesUrl() + imageName;
    },
    getUserAvatarUrl(filename) {
        if (!filename) {
            return this.imagesUrl() + process.env.VUE_APP_NOT_FOUND_AVATAR_NAME;
        }
        return this.uploadsUrl() + filename;
    },
    getUploadedFileUrl(filename) {
        if (!filename) {
            return this.imagesUrl() + process.env.VUE_APP_NOT_FOUND_FILENAME;
        }
        return this.uploadsUrl() + filename;
    },
    generator() {
        return generator;
    }
};
const generator = {
    urlHelper: apiUrlHelperObject,
    offerUrl(offer) {
        const baseUrl = process.env.VUE_APP_API_URL + 'complex/';
        let url = baseUrl + offer.complex_id;
        if (offer.type_id === 3 || !offer) {
            return url;
        }
        if (offer.generalOffersMix) {
            url += '?offer_id=[' + offer.generalOffersMix.original_id + ']';
        } else {
            url += '?offer_id=[' + offer.original_id + ']';
        }
        return url;
    },
    objectUrl(complex_id) {
        const baseUrl = process.env.VUE_APP_API_URL + 'complex/';
        return baseUrl + complex_id;
    },
    pdfUrl(offer, user_id) {
        return (
            this.urlHelper.url() +
            `pdf/presentations?type_id=${offer.type_id}&original_id=${offer.original_id}&object_id=${offer.object_id}&consultant=${user_id}&is_new=1`
        );
    }
};

export const Formatter = {
    install(app) {
        app.config.globalProperties.$formatter = formatterObject;
    }
};

export const ApiUrlHelper = {
    install(app) {
        app.config.globalProperties.$apiUrlHelper = apiUrlHelperObject;
    }
};
