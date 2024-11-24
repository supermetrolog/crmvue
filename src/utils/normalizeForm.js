import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';

export function normalizeDataForCompanyForm(data) {
    data.contacts = data.contacts.find(item => item.type === 1);
    if (!data.contacts)
        data.contacts = {
            emails: [],
            phones: [],
            websites: []
        };

    return data;
}

const FAKE_REGIONS = {
    MSK_AND_MO: 'mskandmo',
    MSK_INSIDE_MKAD: 'mskinsidemkad',
    MO_AND_MSK_OUTSIDE_MKAD: 'moandmskoutsidemkad',
    MO_AND_REGIONS: 'moandregionneardy'
};

export function regionsToFakeRegion(regions, form) {
    let fakeRegion = null;

    if (isNullish(regions) || isEmptyArray(regions)) return fakeRegion;

    const cache = regions.reduce((arr, item) => {
        arr[item] = true;
        return arr;
    }, {});

    if (cache[1] && cache[6])
        fakeRegion = form.outside_mkad
            ? FAKE_REGIONS.MO_AND_MSK_OUTSIDE_MKAD
            : FAKE_REGIONS.MSK_AND_MO;
    else if (cache[1]) fakeRegion = FAKE_REGIONS.MO_AND_REGIONS;
    else if (cache[6]) fakeRegion = FAKE_REGIONS.MSK_INSIDE_MKAD;

    return fakeRegion ?? regions[0];
}
