<template>
  <div class="CompanyRequestItemAlt row m-0 py-4 pb-5 px-2">
    <div class="edit-btn" @click="openCompanyRequestFormForUpdate">
      <i class="fas fa-pen m-2 edit"></i>
    </div>
    <div class="col-4">
      <p class="text-danger mb-1">
        {{ dealType.toUpperCase() }}
        {{ request.minArea + " - " + request.maxArea }}
        <span>
          м<sup><small>2</small></sup>
        </span>
      </p>
      <div class="location mb-4">
        <div class="region">
          <strong>
            {{
              request.regions
                .map((elem) => this.$formatter.text().ucFirst(elem.info.title))
                .join(", ")
            }}
          </strong>
        </div>
        <div class="region-parameters" v-if="request.directions.length">
          <p class="d-block"><b>Московская область:</b></p>
          <p>
            {{
              request.directions
                .map((elem) => this.directionList[elem.direction][2])
                .join(", ")
            }}
          </p>
        </div>
        <div class="region-parameters" v-if="request.districts.length">
          <p class="d-block"><b>Москва:</b></p>
          <p>
            {{
              request.districts
                .map((elem) => this.districtList[elem.district][1])
                .join(", ")
            }}
          </p>
        </div>
        <div>
          <p v-if="!request.distanceFromMKADnotApplicable">
            До {{ request.distanceFromMKAD }} км от МКАД
          </p>
        </div>
      </div>
      <div>
        <span class="mr-3">Класс объекта</span>
        <strong>
          {{
            request.objectClasses
              .map((elem) => this.objectClassList[elem.object_class][1])
              .join(",")
          }}
        </strong>
        <strong v-if="!request.objectClasses.length">нет данных</strong>
      </div>

      <div
        class="parameters-inner d-flex flex-column"
        v-if="request.objectTypes"
      >
        <span class="mb-1">Тип объекта</span>
        <div>
          <strong
            class="object-type-box"
            v-for="objectType of request.objectTypes"
            :key="objectType.id"
            :title="getObjectTypeName(objectType.object_type)"
          >
            <i :class="getObjectTypeIcon(objectType.object_type)"></i>
          </strong>
        </div>
        <p v-if="!request.objectTypes.length">нет данных</p>
      </div>
    </div>
    <div class="col-8 CompanyRequestItemAlt-info-right">
      <!-- <div class="main-info">
          <strong class="text-danger" v-if="request.expressRequest"
            >Срочный запрос</strong
          >
        </div> -->
      <div class="d-flex mb-4">
        <span>Цена пола</span>
        <strong v-if="request.pricePerFloor" class="text-left">
          <small>до</small> {{ request.pricePerFloor }}
          <small>руб. за м<sup>2</sup>/год</small>
        </strong>
        <strong v-else>нет данных</strong>
      </div>
      <div class="d-flex">
        <span>Этажность</span>
        <strong class="parameters-inner">
          {{ request.firstFloorOnly ? "только 1" : "нет данных" }}
        </strong>
      </div>
      <div class="d-flex">
        <span>Темп. режим</span>
        <strong class="parameters-inner">
          {{ request.heated ? "отапливаемый" : "холодный" }}
        </strong>
      </div>
      <div class="d-flex">
        <span>Высота потолков</span>
        <strong class="parameters-inner">
          {{ request.format_ceilingHeight }}
          <span>м</span>
        </strong>
      </div>
      <div class="d-flex">
        <span>Качество пола</span>
        <strong class="parameters-inner">
          {{ request.antiDustOnly ? "только антипыль" : "нет данных" }}
        </strong>
      </div>
      <div class="d-flex mb-4">
        <span>Ворота</span>
        <div>
          <strong v-if="!request.gateTypes.length">нет данных</strong>
          <strong v-if="request.gateTypes.length">
            {{
              request.gateTypes
                .map((elem) => this.gateTypeList[elem.gate_type][1])
                .join(", ")
            }}
          </strong>
        </div>
      </div>
      <div class="d-flex">
        <span>Электричество</span>
        <strong class="parameters-inner">
          {{ `от ${request.electricity} кВт` ?? "нет данных" }}
        </strong>
      </div>
      <div class="d-flex">
        <span>Наличие крана</span>
        <strong class="parameters-inner">
          {{ request.haveCranes ? "да" : "нет" }}
        </strong>
      </div>
      <div class="d-flex">
        <span>Ж/д ветка</span>
        <strong class="parameters-inner">
          {{ request.trainLine ? "да" : "нет" }}
        </strong>
      </div>

      <!-- <p v-if="request.trainLine">
        длина ж/д ветки <small class="text-grey">(м)</small>
      </p>
      <p class="parameters-inner" v-if="request.trainLine">
        {{ request.trainLineLength ?? "нет данных" }}
      </p>
      <p>дата переезда</p>
      <p class="parameters-inner" v-if="request.movingDate">
        {{ request.movingDate_format }}
      </p>
      <p class="parameters-inner" v-if="request.unknownMovingDate !== null">
        {{ unknownMovingDateOptions[request.unknownMovingDate][1] }}
      </p> -->
    </div>
    <div class="col-12 mt-5 d-flex flex-column">
      <span>Описание:</span>
      <strong class="parameters-inner">
        {{ request.description ?? "нет данных" }}
      </strong>
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
  PassiveWhyRequest,
  unknownMovingDate,
} from "@/const/Const.js";
import { mapGetters } from "vuex";
export default {
  name: "CompanyRequestItemAlt",
  components: {},
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
      passiveWhyOptions: PassiveWhyRequest.get("param"),
      unknownMovingDateOptions: unknownMovingDate.get("param"),
    };
  },
  props: {
    request: {
      type: Object,
    },
    reedOnly: {
      type: Boolean,
      default: false,
    },
    editOnly: {
      type: Boolean,
      default: false,
    },
    withDeal: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
    dealType() {
      return this.dealTypeList[this.request.dealType].label;
    },
  },
  methods: {
    openCompanyRequestFormForUpdate() {
      this.$emit("openCompanyRequestFormForUpdate", this.request);
    },
    deleteRequest() {
      this.$emit("deleteRequest", this.request);
    },
    cloneRequest() {
      let data = {
        ...this.request,
      };
      delete data.id;
      delete data.created_at;
      delete data.updated_at;
      data.status = data.status == 2 ? 1 : data.status;
      this.$emit("cloneRequest", data);
    },
    clickTimeline() {
      this.$router.push({
        query: {
          request_id: this.request.id,
          consultant_id: this.THIS_USER.id,
          step: 0,
        },
      });
    },
    getObjectTypeIcon(objectType) {
      if (objectType < 12) {
        return this.objectTypeListWareHouse.find(
          (item) => item[0] == objectType
        )[1].icon;
      }
      if (objectType < 25) {
        return this.objectTypeListProduction.find(
          (item) => item[0] == objectType
        )[1].icon;
      }
      return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
        .icon;
    },
    getObjectTypeName(objectType) {
      if (objectType < 12) {
        return this.objectTypeListWareHouse.find(
          (item) => item[0] == objectType
        )[1].name;
      }
      if (objectType < 25) {
        return this.objectTypeListProduction.find(
          (item) => item[0] == objectType
        )[1].name;
      }
      return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
        .name;
    },
    clickOnItem(event) {
      console.log(event.target.tagName);
      if (
        this.reedOnly ||
        ["I", "BUTTON", "A"].includes(event.target.tagName)
      ) {
        return;
      }

      console.log("click on item");
      const query = { ...this.$route.query };
      if (query.selected_request && query.selected_request == this.request.id) {
        delete query.selected_request;
      } else {
        query.selected_request = this.request.id;
      }

      this.$router.replace({ query });
    },
  },

  emits: ["openCompanyRequestFormForUpdate", "deleteRequest", "cloneRequest"],
};
</script>

<style>
</style>