const textFormatter = {
    ucFirst(string, full = false) {
        if (full)
            return string.replace(/(\s|^)[а-яё]/g, letter => letter.toUpperCase());
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
};

export const formatterObject = {
    currency(number, leng = "ru", options = {}) {
        const defaultOptions = {
            style: "currency",
            currency: "RUB",
            ...options,
        };
        return new Intl.NumberFormat(leng, defaultOptions).format(number);
    },
    number(number, leng = "ru", options = {}) {
        const defaultOptions = {
            ...options,
        };
        return new Intl.NumberFormat(leng, defaultOptions).format(number);
    },
    text() {
        return textFormatter;
    },
    numberRange(range, leng = "ru", options = {}) {
        const numbers = range.split("-").map((num) => num.trim());

        return (
            this.number(numbers[0], leng, options) +
            " - " +
            this.number(numbers[1], leng, options)
        );
    },
    numberOrRange(value) {
        if (!isNaN(value)) return this.number(value);
        if (value.includes("-")) {
            const splittedValue = value.split("-");
            if (!isNaN(splittedValue[0].trim()) && !isNaN(splittedValue[1].trim()))
                return this.numberRange(value);
        }

        return value;
    },
    numberOrRangeNew(valueMin, valueMax) {
        if (valueMin === valueMax) return this.number(valueMin);
        return this.number(valueMin) + " - " + this.number(valueMax);
    },
    formatPhoneNumber(value) {
        let cleaned = ("" + value).replace(/\D/g, "");

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
        }

        return new Date(value * 1000).toLocaleDateString('ru', options);
    }
};

export const apiUrlHelperObject = {
    // prodUrl: "https://api.supermetrolog.ru/",
    prodUrl: "https://api.pennylane.pro/",
    stageUrl: "https://api.supermetrolog.ru/",
    devUrl: "https://api.supermetrolog.ru/",
    reservUrl: "https://reserve-api.supermetrolog.ru/",

    stageHost: "clients.supermetrolog.ru",
    prodHost: "clients.pennylane.pro",
    devHost: "localhost:8080",
    devHostWithoutLocalApi: "localhost:8081",
    reserveHost: "reserve-clients.supermetrolog.ru",

    uploadsPath: "uploads/",
    imagesPath: "images/",
    notFoundFileName: "no-image.jpg",
    notFoundAvatarName: "no-avatar.png",

    // websocket urls
    prodWsUrl: "wss://api.pennylane.pro/websocket/",
    stageWsUrl: "wss://api.supermetrolog.pro/websocket/",
    devWsUrl: "wss://api.pennylane.pro/websocket/",
    reserveWsUrl: "wss://api.supermetrolog.pro/websocket/",

    prodObjectsUrl: "https://pennylane.pro/",
    stageObjectsUrl: "https://pennylane.pro/",
    devObjectsUrl: "http://objects/",
    reserveObjectsUrl: "https://reserve-objects.supermetrolog.ru/",
    wsUrl() {
        let host = window.location.host;
        if (process.env.NODE_ENV === "development") {
            return this.devWsUrl;
        } else {
            if (host === this.stageHost) {
                return this.stageWsUrl;
            } else if (host === this.reserveHost) {
                return this.reserveWsUrl;
            }
            return this.prodWsUrl;
        }
    },
    url() {
        let host = window.location.host;
        if (process.env.NODE_ENV === "development") {
            if (host === this.stageHost || host === this.devHostWithoutLocalApi) {
                return this.stageUrl;
            }

            return this.devUrl;
        } else {
            if (host === this.stageHost) {
                return this.stageUrl;
            } else if (host === this.reserveHost) {
                return this.reservUrl;
            }
            return this.prodUrl;
        }
    },
    objectsUrl() {
        let host = window.location.host;
        if (process.env.NODE_ENV === "development") {
            if (host === this.stageHost || host === this.devHostWithoutLocalApi) {
                return this.stageObjectsUrl;
            }
            return this.devObjectsUrl;
        } else {
            if (host === this.stageHost) {
                return this.stageObjectsUrl;
            } else if (host === this.reserveHost) {
                return this.reserveObjectsUrl;
            }
            return this.prodObjectsUrl;
        }
    },
    uploadsUrl() {
        return this.url() + this.uploadsPath;
    },
    imagesUrl() {
        return this.url() + this.imagesPath;
    },
    fileNotFoundUrl() {
        return this.imagesUrl() + this.notFoundFileName;
    },
    getImageUrl(imageName) {
        return this.imagesUrl() + imageName;
    },
    getUserAvatarUrl(filename) {
        if (!filename) {
            return this.imagesUrl() + this.notFoundAvatarName;
        }
        return this.uploadsUrl() + filename;
    },
    getUploadedFileUrl(filename) {
        if (!filename) {
            return this.imagesUrl() + this.notFoundFileName;
        }
        return this.uploadsUrl() + filename;
    },
    generator() {
        return generator;
    },
};
const generator = {
    urlHelper: apiUrlHelperObject,
    offerUrl(offer) {
        const baseUrl = this.urlHelper.objectsUrl() + "complex/";
        let url = baseUrl + offer.complex_id;
        if (offer.type_id === 3 || !offer) {
            return url;
        }
        if (offer.generalOffersMix) {
            url += "?offer_id=[" + offer.generalOffersMix.original_id + "]";
        } else {
            url += "?offer_id=[" + offer.original_id + "]";
        }
        return url;
    },
    objectUrl(complex_id) {
        const baseUrl = this.urlHelper.objectsUrl() + "complex/";
        let url = baseUrl + complex_id;
        return url;
    },
    pdfUrl(offer, user_id) {
        return (
            this.urlHelper.url() +
            `pdf/presentations?type_id=${offer.type_id}&original_id=${offer.original_id}&object_id=${offer.object_id}&consultant=${user_id}&is_new=1`
        );
    },
};

export const Formatter = {
    install(app) {
        app.config.globalProperties.$formatter = formatterObject;
    },
};

export const ApiUrlHelper = {
    install(app) {
        app.config.globalProperties.$apiUrlHelper = apiUrlHelperObject;
    },
};
