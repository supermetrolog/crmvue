<template>
  <div
    class="CompanyBoxRequestsListItem"
    :class="{
      done: request.status == 2,
      active: request.status == 1,
    }"
  >
    <div class="CompanyBoxRequestsListItem-name header">
      <p>
        {{ dealType }} {{ request.minArea + " - " + request.maxArea }} м<sup
          ><small>2</small></sup
        >
      </p>
    </div>
    <div class="CompanyBoxRequestsListItem-type header">
      <p>{{ status }}</p>
    </div>
    <div class="CompanyBoxRequestsListItem-location">
      <div class="CompanyBoxRequestsListItem-location-region">
        <strong>
          {{
            request.regions
              .map((elem) => this.$formatter.text().ucFirst(elem.info.title))
              .join(", ")
          }}
        </strong>
      </div>
      <div
        class="CompanyBoxRequestsListItem-location-region-parameters"
        v-if="request.directions.length"
      >
        <p><b>Московская область:</b></p>
        <span>
          {{
            request.directions
              .map((elem) => this.directionList[elem.direction][2])
              .join(", ")
          }}
        </span>
      </div>
      <div
        class="CompanyBoxRequestsListItem-location-region-parameters"
        v-if="request.districts.length"
      >
        <p><b>Москва:</b></p>
        <span>
          {{
            request.districts
              .map((elem) => this.districtList[elem.district][1])
              .join(", ")
          }}
        </span>
      </div>
      <div>
        <p v-if="!request.distanceFromMKADnotApplicable">
          до {{ request.distanceFromMKAD }} км до МКАД
        </p>
      </div>
      <DropdownSwitcher
        class="more-button"
        v-model="moreIsOpen"
        :title="'Подробнее'"
      />
      <DropdownContainer v-model="moreIsOpen">
        <hr />
        <div class="row parameters">
          <div class="col-6">
            <p>отапливаемый</p>
            <span class="parameters-inner">
              {{ request.heated ? "да" : "нет" }}
            </span>
            <p>краны</p>
            <span class="parameters-inner">
              {{ request.haveCranes ? "есть" : "нет" }}
            </span>
            <p>только антипыль</p>
            <span class="parameters-inner">
              {{ request.antiDustOnly ? "да" : "нет" }}
            </span>
            <p>высота потолков <small class="text-grey">(м)</small></p>
            <span class="parameters-inner">
              {{ request.format_ceilingHeight }}
            </span>
            <p>площадь пола <small class="text-grey">(м<sup>2</sup>)</small></p>
            <span class="parameters-inner">
              {{ request.minArea + " - " + request.maxArea }}
            </span>
            <p>классы</p>
            <div class="parameters-inner">
              <span>
                {{
                  request.objectClasses
                    .map((elem) => this.objectClassList[elem.object_class][1])
                    .join(", ")
                }}
              </span>
              <span v-if="!request.objectClasses.length">нет данных</span>
            </div>
            <p>тип объекта</p>
            <div class="parameters-inner" v-if="request.objectTypes">
              <span
                v-for="objectType of request.objectTypes"
                :key="objectType.id"
                :title="getObjectTypeName(objectType.object_type)"
              >
                <i :class="getObjectTypeIcon(objectType.object_type)"></i>
              </span>
              <span v-if="!request.objectTypes.length">нет данных</span>
            </div>
          </div>
          <div class="col-6">
            <p>только 1-й этаж</p>
            <span class="parameters-inner">
              {{ request.firstFloorOnly ? "да" : "нет" }}
            </span>
            <p>ж/д ветка</p>
            <span class="parameters-inner">
              {{ request.trainLine ? "есть" : "нет" }}
            </span>
            <span v-if="request.trainLine">
              длина ж/д ветки <small class="text-grey">(м)</small>
            </span>
            <span class="parameters-inner" v-if="request.trainLine">
              {{ request.trainLineLength ?? "нет данных" }}
            </span>
            <p>дата переезда</p>
            <span class="parameters-inner" v-if="request.movingDate">
              {{ request.movingDate_format }}
            </span>
            <span
              class="parameters-inner"
              v-if="request.unknownMovingDate !== null"
            >
              {{ unknownMovingDateOptions[request.unknownMovingDate][1] }}
            </span>

            <p>цена пола <small class="text-grey">(р)</small></p>
            <span class="parameters-inner">
              {{ request.pricePerFloor ?? "нет данных" }}
            </span>
            <p>электричество</p>
            <span class="parameters-inner">
              {{ request.electricity ?? "нет данных" }}
              <small class="text-grey" v-if="request.electricity">(кВт)</small>
            </span>

            <p class="font-weight-bold">ворота</p>
            <div class="parameters-inner">
              <span v-if="!request.gateTypes.length">нет данных</span>
              <span v-else>
                {{
                  request.gateTypes
                    .map((elem) => this.gateTypeList[elem.gate_type][1])
                    .join(", ")
                }}
              </span>
            </div>
          </div>
          <div class="col-12 mt-2">
            <p>Описание</p>
            <span class="parameters-inner">
              {{ request.description ?? "нет данных" }}
            </span>
          </div>
        </div>
      </DropdownContainer>
    </div>
    <div class="CompanyBoxRequestsListItem-action">
      <p v-if="request.consultant.userProfile.short_name">
        конс: <span>{{ request.consultant.userProfile.short_name }}</span>
      </p>
      <p v-if="this.request.created_at">
        {{ dateFormatter(this.request.created_at) }}
      </p>
      <Progress
        class="mt-4"
        :percent="request.timeline_progress"
        title="Обработано"
      />
      <button
        class="btn px-2 btn-primary scale timeline-btn"
        @click="clickTimeline"
      >
        таймлайн
      </button>
    </div>
    <div class="CompanyBoxRequestsListItem-footer" v-if="request.deal">
      <DropdownSwitcher
        v-model="dealIsOpen"
        :title="dealTitle(request.deal.company_id, request.deal.dealDate)"
        v-if="request.deal"
      />
      <DropdownContainer v-model="dealIsOpen">
        <DealItem :deal="request.deal" :reedOnly="true" />
      </DropdownContainer>
    </div>
  </div>
</template>

<script>
import DropdownContainer from "../../../common/dropdown/DropdownContainer.vue";
import DropdownSwitcher from "../../../common/dropdown/DropdownSwitcher.vue";
import Progress from "../../../common/Progress.vue";
import DealItem from "../../companies/deal/DealItem.vue";
import {
  DistrictList,
  DirectionList,
  DealTypeList,
  ObjectTypeList,
  ObjectClassList,
  GateTypeList,
} from "@/const/Const.js";
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  name: "CompanyBoxRequestsListItem",
  components: { DealItem, Progress, DropdownSwitcher, DropdownContainer },
  props: {
    request: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dealTypeList: DealTypeList.get("param"),
      directionList: DirectionList.get("param"),
      districtList: DistrictList.get("param"),
      objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
      objectTypeListProduction: ObjectTypeList.get("production"),
      objectTypeListPlot: ObjectTypeList.get("plot"),
      objectClassList: ObjectClassList.get("param"),
      gateTypeList: GateTypeList.get("param"),
      dealIsOpen: false,
      moreIsOpen: false,
    };
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
    dealType() {
      let dealType = this.dealTypeList[this.request.dealType].label;
      return dealType[0].toUpperCase() + dealType.slice(1);
    },
    status() {
      if (this.request.status == 2) {
        return "Завершен";
      }
      if (this.request.status == 1) {
        return "В работе";
      }
      if (this.request.status == 0) {
        return "Пассив";
      } else {
        return "";
      }
    },
  },
  methods: {
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
    dateFormatter(date) {
      return moment(date).format("DD.MM.YYYY");
    },
    dealTitle(dealName, dealDate) {
      return `Сделка: компания ${dealName}, ${this.dateFormatter(dealDate)}`;
    },
  },
};
</script>