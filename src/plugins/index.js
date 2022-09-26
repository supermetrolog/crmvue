const formatterObject = {
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
    }
};

export const apiUrlHelperObject = {
    // prodUrl: "https://api.supermetrolog.ru/",
    prodUrl: "https://api.pennylane.pro/",
    devUrl: "https://api.supermetrolog.ru/",
    localUrl: "http://crmka/",

    devHost: "clients.supermetrolog.ru",
    prodHost: "clients.pennylane.pro",
    localDevHost: "localhost:8081",

    uploadsPath: "uploads/",
    imagesPath: "images/",
    notFoundFileName: "no-image.jpg",
    notFoundAvatarName: "no-avatar.png",

    // websocket urls


    prodWsUrl: 'wss://api.pennylane.pro/websocket/',
    devWsUrl: 'wss://api.supermetrolog.pro/websocket/',
    localWsUrl: 'ws://localhost:8010',
    wsUrl() {
        if (process.env.NODE_ENV == 'development') {
            return this.localWsUrl;
        } else {
            let host = window.location.host;
            if (host == this.devHost) {
                return this.devWsUrl;
            }
            return this.prodWsUrl;
        }
    },
    url() {
        if (process.env.NODE_ENV == 'development') {
            let host = window.location.host;
            if (host == this.localDevHost) {
                return this.devUrl;
            }
            return this.localUrl;
        } else {
            let host = window.location.host;
            if (host == this.devHost) {
                return this.devUrl;
            }

            return this.prodUrl;
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
    }
};
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