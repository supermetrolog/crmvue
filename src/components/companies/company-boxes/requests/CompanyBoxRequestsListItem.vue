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
        <p>
          {{
            request.directions
              .map((elem) => this.directionList[elem.direction][2])
              .join(", ")
          }}
        </p>
      </div>
      <div
        class="CompanyBoxRequestsListItem-location-region-parameters"
        v-if="request.districts.length"
      >
        <p><b>Москва:</b></p>
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
          до {{ request.distanceFromMKAD }} км до МКАД
        </p>
      </div>
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
import { DistrictList, DirectionList, DealTypeList } from "@/const/Const.js";
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
      dealIsOpen: false,
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
    dateFormatter(date) {
      return moment(date).format("DD.MM.YYYY");
    },
    dealTitle(dealName, dealDate) {
      return `Сделка: компания ${dealName}, ${this.dateFormatter(dealDate)}`;
    },
  },
};
</script>