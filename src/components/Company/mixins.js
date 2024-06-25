import {
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories,
    CompanyFormOrganization,
    PassiveWhy,
    RatingList
} from '@/const/const';
import Progress from '@/components/common/Progress.vue';
import Table from '@/components/common/Table/Table.vue';
import Tr from '@/components/common/Table/Tr.vue';
import Th from '@/components/common/Table/Th.vue';
import {
    DealTypeList,
    DirectionList,
    DistrictList,
    PassiveWhyRequest,
    RegionList
} from '@/const/const.js';
import FileInput from '@/components/common/Forms/FileInput.vue';
import { entityOptions } from '@/const/options/options';

export const MixinCompanyView = {
    components: {
        Progress
    },
    props: {
        companies: {
            type: Array
        },
        loader: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ratingOptions: () => RatingList,
        positionOptions: () => entityOptions.contact.positionList
    },
    methods: {
        category(categoryValue) {
            return CompanyCategories[categoryValue].name;
        }
    }
};

export const MixinRequestTable = {
    components: {
        Table,
        Th,
        Progress,
        Tr
    },
    props: {
        requests: {
            type: Array
        },
        loader: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        dealTypeList: () => DealTypeList,
        regionList: () => RegionList,
        directionList: () => DirectionList,
        districtList: () => DistrictList,
        passiveWhyOptions: () => PassiveWhyRequest
    }
};
