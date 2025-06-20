import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { isEmptyArray } from '@/utils/helpers/array/isEmptyArray.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';

export function normalizeDataForCompanyForm(data, company) {
    data.contacts = company.generalContact;

    if (!data.contacts)
        data.contacts = {
            emails: [],
            phones: [],
            websites: []
        };

    if (company.productRanges?.length) {
        data.productRanges = company.productRanges.map(el => ({
            product: el.product.toLowerCase()
        }));
    }

    if (isNotNullish(company.activity_profiles)) {
        data.activity_profile_ids = company.activity_profiles.map(el => el.activity_profile_id);
    }

    if (isNotNullish(company.activity_groups)) {
        data.activity_group_ids = company.activity_groups.map(el => el.activity_group_id);
    }

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
