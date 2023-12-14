import {
    ActivityGroupList,
    ActivityProfileList,
    CompanyCategories,
    CompanyFormOrganization,
    PassiveWhy,
    PositionList,
    RatingList
} from "@/const/const";
import Progress from "@/components/common/Progress.vue";
import Table from "@/components/common/Table/Table.vue";
import Tr from "@/components/common/Table/Tr.vue";
import Th from "@/components/common/Table/Th.vue";
import {DealTypeList, DirectionList, DistrictList, PassiveWhyRequest, RegionList,} from "@/const/const.js";
import FileInput from "@/components/common/Forms/FileInput.vue";

export const MixinCompanyView = {
    components: {
        Progress,
    },
    data() {
        return {
            ratingOptions: RatingList.get("param"),
            positionOptions: PositionList.get("param"),
        };
    },
    props: {
        companies: {
            type: Array,
        },
        loader: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        category(categoryValue) {
            return CompanyCategories.get("param")[categoryValue][1];
        },
    },
};

export const MixinRequestTable = {
    components: {
        Table,
        Th,
        Progress,
        Tr,
    },
    data() {
        return {
            dealTypeList: DealTypeList.get("param"),
            regionList: RegionList.get("param"),
            directionList: DirectionList.get("param"),
            districtList: DistrictList.get("param"),
            passiveWhyOptions: PassiveWhyRequest.get("param"),
        };
    },
    props: {
        requests: {
            type: Array,
        },
        loader: {
            type: Boolean,
            default: false,
        },
    },
};

export const MixinCompanyDetailInfo = {
    components: {
        Progress,
        FileInput,
    },
    data() {
        return {
            requisistesVisible: false,
            formOfOrganizationOptions: CompanyFormOrganization.get("param"),
            activityGroupOptions: ActivityGroupList.get("param"),
            activityProfileOptions: ActivityProfileList.get("param"),
            passiveWhyOptions: PassiveWhy.get("param"),
        };
    },
    props: {
        company: {
            type: Object,
        },
    },
    computed: {
        status() {
            return this.company.active ? "Актив" : "Пассив";
        },
        generalContact() {
            return this.company.contacts.find((item) => item.type == 1);
        },
        contactsTypeGeneralPhone() {
            const contacts = this.company.contacts.find((item) => item.type == 1);
            return contacts ? contacts : false;
        },
        contactsTypeGeneralEmail() {
            const contacts = this.company.contacts.filter((item) => item.type != 0);
            return contacts[0] ? contacts[0].emails : false;
        },
        contactsTypeGeneralWebsite() {
            const contacts = this.company.contacts.filter((item) => item.type != 0);
            return contacts[0] ? contacts[0].websites : false;
        },
    },
    methods: {
        rating(value) {
            if (this.company.rating >= value) {
                return "text-warning fas fa-star";
            }
            return "text-dark far fa-star";
        },
        category(categoryValue) {
            return CompanyCategories.get("param")[categoryValue][1];
        },
        href(value) {
            if (value.includes("http://") || value.includes("https://")) {
                return value;
            }
            return "https://" + value;
        },
        toggleRequisistesVisible() {
            this.requisistesVisible = !this.requisistesVisible;
        },
    },
};
