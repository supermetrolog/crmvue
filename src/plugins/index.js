const textFormatter = {
    ucFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
}
const dateFormatter = {
    locale(date, locale, options) {
        const localDate = new Date(date);
        return localDate.toLocaleString(locale, options);
    }
}
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
    date() {
        return dateFormatter;
    }
};

export const apiUrlHelperObject = {
    // prodUrl: "https://api.supermetrolog.ru/",
    prodUrl: "https://api.pennylane.pro/",
    stageUrl: "https://api.supermetrolog.ru/",
    devUrl: "http://crmka/",

    stageHost: "clients.supermetrolog.ru",
    prodHost: "clients.pennylane.pro",
    devHost: "localhost:8080",
    devHostWithoutLocalApi: "localhost:8081",

    uploadsPath: "uploads/",
    imagesPath: "images/",
    notFoundFileName: "no-image.jpg",
    notFoundAvatarName: "no-avatar.png",

    // websocket urls
    prodWsUrl: 'wss://api.pennylane.pro/websocket/',
    stageWsUrl: 'wss://api.supermetrolog.pro/websocket/',
    devWsUrl: 'ws://localhost:8010',

    prodObjectsUrl: "https://pennylane.pro/",
    stageObjectsUrl: "https://pennylane.pro/",
    devObjectsUrl: "http://objects/",
    wsUrl() {
        if (process.env.NODE_ENV == 'development') {
            return this.devWsUrl;
        } else {
            let host = window.location.host;
            if (host == this.stageHost) {
                return this.stageWsUrl;
            }
            return this.prodWsUrl;
        }
    },
    url() {
        let host = window.location.host;
        if (process.env.NODE_ENV == 'development') {
            if (host == this.stageHost || host == this.devHostWithoutLocalApi) {
                return this.stageUrl;
            }

            return this.devUrl;
        } else {
            if (host == this.stageHost) {
                return this.stageUrl;
            }
            return this.prodUrl;
        }
    },
    objectsUrl() {
        let host = window.location.host;
        if (process.env.NODE_ENV == 'development') {
            return this.devObjectsUrl;
        } else {
            if (host == this.stageHost) {
                return this.stageObjectsUrl;
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
    }
};
const generator = {
    urlHelper: apiUrlHelperObject,
    offerUrl(offer) {
        const baseUrl = this.urlHelper.objectsUrl() + "complex/";
        let url = baseUrl + offer.complex_id;
        if (offer.type_id == 3 || !offer) {
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
    }
}

export const Formatter = {
    install(app, options) {
        console.log(app, options);
        app.config.globalProperties.$formatter = formatterObject;
    }
}

export const ApiUrlHelper = {
    install(app, options) {
        console.log(app, options);
        app.config.globalProperties.$apiUrlHelper = apiUrlHelperObject;
    }
}