export const $generatorURL = {
    _api: import.meta.env.VITE_VUE_APP_API_URL,
    _host: import.meta.env.VITE_VUE_APP_HOST,
    _old_host: import.meta.env.VITE_VUE_APP_OBJECT_URL,
    _cadastral: 'https://pkk5.rosreestr.ru/#x=4034393.888696498&y=6756994.231129&z=20',
    offerByObject: function (offer) {
        let url = this._host + '/complex/' + offer.complex_id;

        if (offer.type_id === 3 || !offer) {
            return url;
        }
        if (offer.generalOffersMix) {
            url += '?offer_id=' + offer.generalOffersMix.original_id + '';
        } else {
            url += '?offer_id=' + offer.original_id + '';
        }

        return url;
    },
    offer: function (complex_id, offer_id) {
        return this._host + '/complex/' + complex_id + '?offer_id=' + offer_id;
    },
    offerOldByObject: function (offer) {
        let url = this._old_host + '/complex/' + offer.complex_id;

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
    complexOld: function (complexID, offerID = null) {
        const baseUrl = import.meta.env.VITE_VUE_APP_OBJECT_URL + '/complex/';
        let url = baseUrl + complexID;

        if (offerID) {
            url += '?offer_id=[' + offerID + ']';
        }

        return url;
    },
    complex: function (id) {
        return this._host + '/complex/' + id;
    },
    company: function (id) {
        return this._host + '/companies/' + id;
    },
    pdf: function ({ type_id = 1, offer_id, object_id }, user_id) {
        return (
            this._api +
            `pdf/presentations?type_id=${type_id}&original_id=${offer_id}&object_id=${object_id}&consultant=${user_id}&is_new=1`
        );
    },
    file: function (url) {
        return import.meta.env.VITE_VUE_APP_OBJECTS_PHOTO_URL + url;
    },
    cadastral: function (number) {
        return this._cadastral + '&text=' + number + '&type=1&app=search&opened=1';
    },
    api: {
        url: function () {
            let host = window.location.host;

            if (host === import.meta.env.VITE_VUE_APP_RESERVE_HOST) {
                return import.meta.env.VITE_VUE_APP_RESERVE_API_URL;
            }

            return import.meta.env.VITE_VUE_APP_API_URL;
        },
        objects: function () {
            return import.meta.env.VITE_VUE_APP_OBJECTS_PHOTO_URL;
        },
        uploads: function () {
            return import.meta.env.VITE_VUE_APP_API_URL + import.meta.env.VITE_VUE_APP_UPLOADS_PATH;
        },
        imagesUrl: function () {
            return import.meta.env.VITE_VUE_APP_API_URL + import.meta.env.VITE_VUE_APP_IMAGES_PATH;
        },
        fileNotFound: function () {
            return this.imagesUrl() + import.meta.env.VITE_VUE_APP_NOT_FOUND_FILENAME;
        },
        archiver: function () {
            return import.meta.env.VITE_VUE_APP_API_URL + 'archiver/download';
        },
        getImage: function (imageName) {
            return this.imagesUrl() + imageName;
        },
        getUserAvatar: function (filename) {
            if (!filename) {
                return this.imagesUrl() + import.meta.env.VITE_VUE_APP_NOT_FOUND_AVATAR_NAME;
            }
            return this.uploads() + filename;
        },
        getUploadedFileUrl: function (filename) {
            if (!filename) {
                return this.imagesUrl() + import.meta.env.VITE_VUE_APP_NOT_FOUND_FILENAME;
            }
            return this.uploads() + filename;
        }
    }
};

const Url = {
    install: function (app) {
        app.config.globalProperties.$url = $generatorURL;
    }
};

export default Url;
