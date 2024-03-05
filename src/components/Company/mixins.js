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

export const MixinCompanyDetailInfo = {
    components: {
        Progress,
        FileInput
    },
    data() {
        return {
            requisistesVisible: false
        };
    },
    props: {
        company: {
            type: Object
        }
    },
    computed: {
        formOfOrganizationOptions: () => CompanyFormOrganization,
        activityGroupOptions: () => ActivityGroupList,
        activityProfileOptions: () => ActivityProfileList,
        passiveWhyOptions: () => PassiveWhy,
        status() {
            return this.company.active ? 'Актив' : 'Пассив';
        },
        generalContact() {
            return this.company.contacts.find(item => item.type == 1);
        },
        contactsTypeGeneralPhone() {
            const contacts = this.company.contacts.find(item => item.type == 1);
            return contacts ? contacts : false;
        },
        contactsTypeGeneralEmail() {
            const contacts = this.company.contacts.filter(item => item.type != 0);
            return contacts[0] ? contacts[0].emails : false;
        },
        contactsTypeGeneralWebsite() {
            const contacts = this.company.contacts.filter(item => item.type != 0);
            return contacts[0] ? contacts[0].websites : false;
        }
    },
    methods: {
        rating(value) {
            if (this.company.rating >= value) {
                return 'text-warning fas fa-star';
            }
            return 'text-dark far fa-star';
        },
        category(categoryValue) {
            return CompanyCategories[categoryValue].name;
        },
        href(value) {
            if (value.includes('http://') || value.includes('https://')) {
                return value;
            }
            return 'https://' + value;
        },
        toggleRequisistesVisible() {
            this.requisistesVisible = !this.requisistesVisible;
        }
    }
};
