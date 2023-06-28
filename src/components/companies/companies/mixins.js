import Progress from "@/components/common/Progress";
import { CompanyCategories, RatingList, PositionList } from "@/const/Const";
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
import Tr from "../../common/table/Tr.vue";
import Table from "@/components/common/table/Table";
import Th from "@/components/common/table/Th";
import {
  DealTypeList,
  RegionList,
  DirectionList,
  DistrictList,
  PassiveWhyRequest,
} from "@/const/Const.js";
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
import FileInput from "@/components/common/form/FileInput";
import {
  CompanyFormOrganization,
  ActivityGroupList,
  ActivityProfileList,
  PassiveWhy,
} from "@/const/Const";
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
