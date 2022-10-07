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
