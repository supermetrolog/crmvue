import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';

const API = import.meta.env.VITE_VUE_APP_API_URL;
const HOST = import.meta.env.VITE_VUE_APP_HOST;
const OLD_HOST = import.meta.env.VITE_VUE_APP_OBJECT_URL;
const FILES = import.meta.env.VITE_VUE_APP_OBJECTS_PHOTO_URL;
const CADASTRAL = 'https://pkk5.rosreestr.ru/#x=4034393.888696498&y=6756994.231129&z=20';

export function getLinkOfferByObject(offer) {
    let url = HOST + '/complex/' + offer.complex_id;

    if (offer.type_id === 3 || !offer) {
        return url;
    }

    if (offer.generalOffersMix) {
        url += '?offer_id=' + offer.generalOffersMix.original_id + '';
    } else if (isNotNullish(offer.original_id)) {
        url += '?offer_id=' + offer.original_id;
    } else {
        url += '?offer_id=' + offer.offer_id;
    }

    return url;
}

export function getLinkOffer(complex_id, offer_id) {
    return HOST + '/complex/' + complex_id + '?offer_id=' + offer_id;
}

export function getLinkOfferOldByObject(offer) {
    let url = OLD_HOST + '/complex/' + offer.complex_id;

    if (offer.type_id === 3 || !offer) return url;

    if (offer.generalOffersMix) {
        url += '?offer_id=[' + offer.generalOffersMix.original_id + ']';
    } else {
        url += '?offer_id=[' + offer.original_id + ']';
    }

    return url;
}

export function getLinkComplexOld(complexID, offerID = null) {
    const url = OLD_HOST + '/complex/' + complexID;

    if (offerID) return url + '?offer_id=[' + offerID + ']';
    return url;
}

export function getLinkComplex(id) {
    return HOST + '/complex/' + id;
}

export function getLinkCompany(id) {
    return HOST + '/companies/' + id;
}

export function getLinkPDF({ type_id = 1, offer_id, object_id }, user_id) {
    return (
        API +
        `pdf/presentations?type_id=${type_id}&original_id=${offer_id}&object_id=${object_id}&consultant=${user_id}&is_new=1`
    );
}

export function getLinkFile(url) {
    return FILES + url;
}

export function getLinkCadastral(number) {
    return CADASTRAL + '&text=' + number + '&type=1&app=search&opened=1';
}

export function getApiUrl() {
    const host = window.location.host;
    if (host === import.meta.env.VITE_VUE_APP_RESERVE_HOST)
        return import.meta.env.VITE_VUE_APP_RESERVE_API_URL;
    return API;
}

export function getApiObjects() {
    return FILES;
}

export function getApiUploads() {
    return API + import.meta.env.VITE_VUE_APP_UPLOADS_PATH;
}

export function getApiImages() {
    return API + import.meta.env.VITE_VUE_APP_IMAGES_PATH;
}

export function getApiFileNotFound() {
    return getApiImages() + import.meta.env.VITE_VUE_APP_NOT_FOUND_FILENAME;
}

export function getApiArchiver() {
    return API + 'archiver/download';
}

export function getLinkUpload(src) {
    return getApiObjects() + src;
}

export function getLinkImages(src) {
    return getApiImages() + src;
}

export function getLinkUserAvatar(filename) {
    if (!filename) {
        return getApiImages() + import.meta.env.VITE_VUE_APP_NOT_FOUND_AVATAR_NAME;
    }
    return getApiUploads() + filename;
}

export function getLinkUploadedFile(filename) {
    if (!filename) {
        return getApiImages() + import.meta.env.VITE_VUE_APP_NOT_FOUND_FILENAME;
    }
    return getApiUploads() + filename;
}

export function getTimelineLink(companyId, requestId, userId) {
    return `${HOST}/companies/${companyId}?request_id=${requestId}&consultant_id=${userId}&step=0`;
}
