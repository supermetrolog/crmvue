<template>
  <div
    class="row item mb-2"
    :class="{ done: request.status == 2, active: request.status == 1 }"
  >
    <div class="col-12 text-center general-info py-2">
      <div class="header">
        <i
          class="fas fa-pen text-primary edit"
          @click="openCompanyRequestFormForUpdate"
          v-if="!reedOnly"
        ></i>
        <i
          class="fas fa-times text-danger delete"
          @click="deleteRequest"
          v-if="!reedOnly"
        ></i>
        <p>{{ dealType }} {{ request.minArea + " - " + request.maxArea }}</p>
        <span>
          м<sup><small>2</small></sup>
        </span>
      </div>
      <div class="body mt-1">
        <div class="main-info">
          <div class="location">
            <div class="region">
              <strong
                class="mr-1"
                v-for="(region, index) of request.regions"
                :key="region.id"
              >
                {{ getRegion(region.region, index) }}
              </strong>
            </div>
            <div class="region-parameters">
              <p v-for="direction of request.directions" :key="direction.id">
                {{ getDirection(direction.direction) }}
              </p>
              <p v-if="request.distanceFromMKAD">
                до {{ request.distanceFromMKAD }} км,
              </p>
              <p v-for="district of request.districts" :key="district.id">
                {{ getDistrict(district.district) }}
              </p>
            </div>
          </div>
          <strong class="text-danger" v-if="request.expressRequest"
            >Срочный запрос</strong
          >
        </div>
        <i
          class="far fa-arrow-alt-circle-down d-block open-extra-info mt-1"
          @click="openExtraInfo"
          v-if="!extraInfoVisible"
        ></i>
        <i
          class="far fa-arrow-alt-circle-up d-block open-extra-info mt-1"
          @click="closeExtraInfo"
          v-if="extraInfoVisible"
        ></i>
        <div class="extra-info" v-if="extraInfoVisible">
          <hr />
          <div class="row parameters">
            <div class="col-6">
              <p class="single" v-if="request.firstFloorOnly">
                только 1-й этаж
              </p>
              <p class="single" v-if="request.antiDustOnly">только антипыль</p>
              <p class="single" v-if="request.heated">отапливаемый</p>
              <p class="single" v-if="request.haveCranes">краны</p>
              <p>высота потолков</p>
              <p class="parameters-inner">
                {{
                  request.minCeilingHeight + " - " + request.maxCeilingHeight
                }}
                м
              </p>
              <p v-if="request.objectClasses">классы</p>
              <div class="parameters-inner">
                <p
                  v-for="(objectClass, index) of request.objectClasses"
                  :key="objectClass.id"
                >
                  {{ getObjectClass(objectClass.object_class, index) }}
                </p>
              </div>
              <p v-if="request.objectTypes">тип объекта</p>
              <div class="parameters-inner" v-if="request.objectTypes">
                <p
                  v-for="objectType of request.objectTypes"
                  :key="objectType.id"
                  :title="getObjectTypeName(objectType.object_type)"
                >
                  <i :class="getObjectTypeIcon(objectType.object_type)"></i>
                </p>
              </div>
            </div>
            <div class="col-6">
              <p v-if="request.trainLine">ж/д ветка</p>
              <p class="parameters-inner" v-if="request.trainLine">
                {{ request.trainLineLength }} м
              </p>
              <p v-if="request.pricePerFloor">цена пола</p>
              <p class="parameters-inner" v-if="request.pricePerFloor">
                {{ request.pricePerFloor }} р
              </p>
              <p v-if="request.electricity">электричество</p>
              <p class="parameters-inner" v-if="request.electricity">
                {{ request.electricity }} кВт
              </p>
              <p class="font-weight-bold" v-if="request.gateTypes">ворота:</p>
              <div class="parameters-inner">
                <p
                  v-for="(gateType, index) of request.gateTypes"
                  :key="gateType.id"
                >
                  {{ getGateType(gateType.gate_type, index) }}
                </p>
              </div>
            </div>
            <div class="col-12 mt-2" v-if="request.description">
              <p>Описание</p>
              <p class="parameters-inner">
                {{ request.description }}
              </p>
            </div>
          </div>
        </div>
        <Progress class="mt-2" :percent="56" />
      </div>
      <div class="footer row mt-1">
        <div class="col-8 consultant text-left">
          <p>конс: {{ request.consultant.username }}</p>
          <p>{{ request.created_at }}</p>
        </div>
        <div class="col-4 date text-right" v-if="!reedOnly">
          <button
            class="btn px-2 btn-primary scale timeline-btn"
            @click="clickTimeline"
          >
            таймлайн
          </button>
        </div>
      </div>
    </div>
    <div class="col-12 deal-info py-2" v-if="request.deal">
      <div class="row">
        <div class="col-4 text-center align-self-center">
          <i class="fas fa-handshake"></i>
        </div>
        <div class="col-8 px-0">
          <div class="row no-gutters">
            <div class="col-4 text-right pr-2"><p>название:</p></div>
            <div class="col-8 pl-4">
              <strong class="">{{ request.deal.name }}</strong>
            </div>
            <div class="col-4 text-right pr-2"><p>объект:</p></div>
            <div class="col-8 pl-4">
              <strong>
                <a
                  :href="`https://pennylane.pro/complex/${request.deal.complex_id}?offer_id=[${request.deal.original_id}]`"
                  target="_blanc"
                >
                  #{{ request.deal.complex_id }}~{{ request.deal.object_id }}
                </a>
              </strong>
            </div>
            <div class="col-4 text-right pr-2"><p>площадь:</p></div>
            <div class="col-8 pl-4">
              <strong class="">{{ request.deal.area }} м<sup>2</sup></strong>
            </div>
            <div class="col-4 text-right pr-2"><p>цена пола:</p></div>
            <div class="col-8 pl-4">
              <strong class="">{{ request.deal.floorPrice }} р</strong>
            </div>
            <div class="col-4 text-right pr-2"><p>консультант:</p></div>
            <div class="col-8 pl-4">
              <strong class="">{{ request.deal.consultant.username }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ObjectClassList,
  GateTypeList,
  ObjectTypeList,
  RegionList,
  DirectionList,
  DistrictList,
  DealTypeList,
} from "@/const/Const.js";
import Progress from "@/components/Progress.vue";
export default {
  name: "CompanyRequestItem",
  components: {
    Progress,
  },
  data() {
    return {
      objectClassList: ObjectClassList.get("param"),
      gateTypeList: GateTypeList.get("param"),
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
      regionList: RegionList.get("param"),
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      dealTypeList: DealTypeList.get("param"),
      extraInfoVisible: false,
    };
  },
  props: {
    request: {
      type: Object,
    },
    reedOnly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  computed: {
    dealType() {
      return this.dealTypeList[this.request.dealType].label;
    },
  },
  methods: {
    openCompanyRequestFormForUpdate() {
      this.$emit("openCompanyRequestFormForUpdate", this.request);
    },
    deleteRequest() {
      let data = {
        ...this.request,
      };
      data.header =
        this.dealType +
        " " +
        this.request.minArea +
        " - " +
        this.request.maxArea;
      this.$emit("deleteRequest", data);
    },
    openExtraInfo() {
      this.extraInfoVisible = true;
    },
    closeExtraInfo() {
      this.extraInfoVisible = false;
    },
    clickTimeline() {
      this.$router.push({ query: { timeline: this.request.id } });
    },
    getRegion(region, index) {
      if (index != this.request.regions.length - 1) {
        return this.regionList[region].label + ",";
      }
      return this.regionList[region].label;
    },
    getDirection(direction) {
      return this.directionList[direction][2] + ",";
    },
    getDistrict(district) {
      return this.districtList[district][1] + ",";
    },
    getObjectClass(objectClass, index) {
      if (index != this.request.objectClasses.length - 1) {
        return this.objectClassList[objectClass][1] + ",";
      }
      return this.objectClassList[objectClass][1];
    },
    getGateType(gateType, index) {
      if (index != this.request.gateTypes.length - 1) {
        return this.gateTypeList[gateType][1] + ",";
      }
      return this.gateTypeList[gateType][1];
    },
    getObjectTypeIcon(objectType) {
      if (objectType < 11) {
        return this.objectTypeListWareHouse.find(
          (item) => item[0] == objectType
        )[1].icon;
      }
      if (objectType < 24) {
        return this.objectTypeListProduction.find(
          (item) => item[0] == objectType
        )[1].icon;
      }
      return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
        .icon;
    },
    getObjectTypeName(objectType) {
      if (objectType < 11) {
        return this.objectTypeListWareHouse.find(
          (item) => item[0] == objectType
        )[1].name;
      }
      if (objectType < 24) {
        return this.objectTypeListProduction.find(
          (item) => item[0] == objectType
        )[1].name;
      }
      return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
        .name;
    },
  },
  mounted() {
    this.extraInfoVisible = this.reedOnly;
  },
  emits: ["openCompanyRequestFormForUpdate", "deleteRequest"],
};
</script>

<style>
</style>