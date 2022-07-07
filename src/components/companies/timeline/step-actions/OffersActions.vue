<template>
  <div class="step-action">
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal"
        leave-active-class="animate__animated animate__zoomOut for__modal"
      >
        <Bar title="Избранное" v-if="barVisible" @close="favorites">
          <Objects>
            <ObjectsList
              :objects="selectedObjects"
              :currentObjects="step.timelineStepObjects"
              :selectedObjects="selectedObjects"
              :disabled="true"
              :withSeparator="true"
              :loader="loader"
              :viewMode="true"
              col="col-6"
              label="Выбранные предложения"
              @select="select"
              @unSelect="unSelect"
              @addComment="addComment"
            />
          </Objects>
        </Bar>
      </transition>
    </teleport>
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2">
          <div class="col-6">
            <div class="timeline-actions row"></div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <Objects>
              <ObjectsControllPanel
                :viewMode="viewMode"
                :buttons="buttons"
                @reset="reset"
                @done="done"
                @send="send"
                @alreadySent="alreadySent"
                @negative="negative"
                @favorites="favorites"
                @changeViewMode="changeViewMode"
                @openExtraVisible="openExtraVisible"
                @closeExtraVisible="closeExtraVisible"
                ref="contoll_panel"
              />
              <ObjectsList
                :objects="preventStepObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :withSeparator="true"
                :loader="loader"
                :viewMode="viewMode"
                :currentStepId="step.id"
                label="Отправленные предложения"
                @select="select"
                @unSelect="unSelect"
                @addComment="addComment"
              />
              <div
                class="
                  timeline-actions timeline-list-item
                  p-1
                  row
                  justify-content-center
                "
              >
                <CustomButton
                  :options="{
                    btnActive: recommendedFilter == 6,
                    btnClass: 'success',
                    defaultBtn: true,
                    disabled: false,
                  }"
                  class="d-inline"
                  @confirm="getSortRecommendedObjects()"
                >
                  <template #btnContent> SORT</template>
                </CustomButton>
                <CustomButton
                  :options="{
                    btnActive: recommendedFilter == 1,
                    btnClass: 'primary',
                    defaultBtn: true,
                    disabled: false,
                  }"
                  class="d-inline ml-2"
                  @confirm="getFirstRecommendedObjects()"
                >
                  <template #btnContent> ПОДБОРКА 1</template>
                </CustomButton>
                <CustomButton
                  :options="{
                    btnActive: recommendedFilter == 2,
                    btnClass: 'warning',
                    defaultBtn: true,
                    disabled: false,
                  }"
                  class="d-inline ml-2"
                  @confirm="getTwoRecommendedObjects()"
                >
                  <template #btnContent> ПОДБОРКА 2</template>
                </CustomButton>
                <CustomButton
                  :options="{
                    btnActive: recommendedFilter == 3,
                    btnClass: 'primary',
                    defaultBtn: true,
                    disabled: false,
                  }"
                  class="d-inline ml-2"
                  @confirm="getThreeRecommendedObjects()"
                >
                  <template #btnContent> ПОДБОРКА 3</template>
                </CustomButton>
                <CustomButton
                  :options="{
                    btnActive: recommendedFilter == 4,
                    btnClass: 'warning',
                    defaultBtn: true,
                    disabled: false,
                  }"
                  class="d-inline ml-2"
                  @confirm="getFourRecommendedObjects()"
                >
                  <template #btnContent> ПОДБОРКА 4</template>
                </CustomButton>
                <CustomButton
                  v-if="currentRequest.dealType != 1"
                  :options="{
                    btnActive: recommendedFilter == 5,
                    btnClass: 'primary',
                    defaultBtn: true,
                    disabled: false,
                  }"
                  class="d-inline ml-2"
                  @confirm="getFiveRecommendedObjects()"
                >
                  <template #btnContent> ПОДБОРКА 5</template>
                </CustomButton>
              </div>

              <ObjectsSearch
                @search="search"
                @reset="recommendedFilter = null"
                noUrl
                :queryParams="queryParams"
                class="mb-2"
                :class="{ 'action-open': controllPanelHeight > 50 }"
              />
              <ObjectsList
                :objects="allObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :loader="allObjectsLoader"
                :viewMode="viewMode"
                :pagination="pagination"
                :currentStepId="step.id"
                @select="select"
                @unSelect="unSelect"
                @addComment="addComment"
                @deleteFavoriteOffer="deleteFavoriteOffer"
              />
              <Pagination
                :pagination="pagination"
                @loadMore="loadMore"
                class="text-center"
              />
            </Objects>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MixinStepActions } from "../mixins";
import { MixinAllObject } from "../../objects/mixins";
import CustomButton from "@/components/common/CustomButton.vue";
import Bar from "@/components/common/Bar";
export default {
  name: "OffersActions",
  mixins: [MixinStepActions, MixinAllObject],
  components: {
    Bar,
    CustomButton,
  },
  data() {
    return {
      recommendedFilter: null,
      queryParams: null,
    };
  },
  defaultQueryParams: {
    all: null,
    rangeMinElectricity: null,
    rangeMaxDistanceFromMKAD: null,
    deal_type: null,
    agent_id: null,
    rangeMaxArea: null,
    rangeMinArea: null,
    rangeMaxPricePerFloor: null,
    rangeMinPricePerFloor: null,
    rangeMinCeilingHeight: null,
    rangeMaxCeilingHeight: null,
    class: [],
    gates: [],
    heated: null,
    water: null,
    gas: null,
    steam: null,
    sewage_central: null,
    racks: null,
    railway: null,
    has_cranes: null,
    floor_types: [],
    purposes: [],
    object_type: [],
    region: [],
    direction: [],
    district_moscow: [],
    status: null,
    // new fields
    recommended_sort: null,
    approximateDistanceFromMKAD: null,
    pricePerFloor: null,
    type_id: null,
    firstFloorOnly: null,
  },
  methods: {
    updatedObjects(data, fn) {
      this.barVisible = false;
      this.$emit("updatedObjects", data, true, fn);
    },
    openExtraVisible() {
      this.$nextTick(() => {
        this.controllPanelHeight = this.$refs.contoll_panel.$el.clientHeight;
      });
    },
    closeExtraVisible() {
      this.$nextTick(() => {
        this.controllPanelHeight = this.$refs.contoll_panel.$el.clientHeight;
      });
    },
    getSortRecommendedObjects() {
      this.changeRecommendedFilter(6);
      if (!this.recommendedFilter) {
        this.queryParams = this.$options.defaultQueryParams;
        return;
      }
      const request = this.currentRequest;
      const query = {
        rangeMinElectricity: request.electricity,
        approximateDistanceFromMKAD: request.distanceFromMKAD,
        deal_type: request.dealType,
        rangeMaxArea: request.maxArea,
        rangeMinArea: request.minArea,
        rangeMaxPricePerFloor: request.pricePerFloor,
        rangeMinCeilingHeight: request.minCeilingHeight,
        rangeMaxCeilingHeight: request.maxCeilingHeight,
        heated: request.heated == 0 ? 2 : request.heated,
        has_cranes: request.haveCranes,
        floor_types: request.antiDustOnly ? [2] : [],
        region: request.regions.map((item) => item.region),
        status: 1,
        type_id: [1, 2],
        gates: request.gateTypes.map((item) => item.gate_type),
        direction: request.directions.map((item) => item.direction),
        district_moscow: request.districts.map((item) => item.district),
        firstFloorOnly: request.firstFloorOnly ? 1 : null,
        recommended_sort: 1, // ФИЛЬТРЫ ПЕРЕСТАНУТ РАБОТАТЬ И БУДЕТ ВЫДАВАТЬСЯ РЕЗУЛЬТАТЫ ОТСОРТИРОВАННЫЕ ПО КОЛЛИЧЕСТВУ СОВПАДЕНИЙ
      };
      this.queryParams = {
        ...this.$options.defaultQueryParams,
        ...query,
      };
    },
    getFirstRecommendedObjects() {
      this.changeRecommendedFilter(1);
      if (!this.recommendedFilter) {
        this.queryParams = this.$options.defaultQueryParams;
        return;
      }
      const request = this.currentRequest;
      const query = {
        rangeMinElectricity: request.electricity,
        approximateDistanceFromMKAD: request.distanceFromMKAD,
        deal_type: request.dealType,
        rangeMaxArea: request.maxArea,
        rangeMinArea: request.minArea,
        rangeMaxPricePerFloor: request.pricePerFloor,
        rangeMinCeilingHeight: request.minCeilingHeight,
        rangeMaxCeilingHeight: request.maxCeilingHeight,
        heated: request.heated == 0 ? 2 : request.heated,
        has_cranes: request.haveCranes,
        floor_types: request.antiDustOnly ? [2] : [],
        region: request.regions.map((item) => item.region),
        status: 1,
        type_id: [1, 2],
        gates: request.gateTypes.map((item) => item.gate_type),
        direction: request.directions.map((item) => item.direction),
        district_moscow: request.districts.map((item) => item.district),
        firstFloorOnly: request.firstFloorOnly ? 1 : null,
        recommended_sort: null,
        sort_original_id: this.$route.query.new_original_id,
        sort: this.$route.query.new_original_id ? "-original_ids" : null,
      };
      this.queryParams = {
        ...this.$options.defaultQueryParams,
        ...query,
      };
    },
    getTwoRecommendedObjects() {
      this.changeRecommendedFilter(2);
      if (!this.recommendedFilter) {
        this.queryParams = this.$options.defaultQueryParams;
        return;
      }
      const request = this.currentRequest;
      const query = {
        rangeMinElectricity: request.electricity,
        approximateDistanceFromMKAD: request.distanceFromMKAD,
        deal_type: request.dealType,
        rangeMaxArea: request.maxArea,
        rangeMinArea: request.minArea,
        rangeMaxPricePerFloor: request.pricePerFloor,
        rangeMinCeilingHeight: request.minCeilingHeight,
        rangeMaxCeilingHeight: request.maxCeilingHeight,
        heated: request.heated == 0 ? 2 : request.heated,
        has_cranes: request.haveCranes,
        floor_types: request.antiDustOnly ? [2] : [],
        region: request.regions.map((item) => item.region),
        status: 2,
        type_id: [1, 2],
        gates: request.gateTypes.map((item) => item.gate_type),
        direction: request.directions.map((item) => item.direction),
        district_moscow: request.districts.map((item) => item.district),
        firstFloorOnly: request.firstFloorOnly ? 1 : null,
        recommended_sort: null,
      };
      this.queryParams = {
        ...this.$options.defaultQueryParams,
        ...query,
      };
    },
    getThreeRecommendedObjects() {
      this.changeRecommendedFilter(3);
      if (!this.recommendedFilter) {
        this.queryParams = this.$options.defaultQueryParams;
        return;
      }
      const request = this.currentRequest;
      const query = {
        rangeMinElectricity: null,
        approximateDistanceFromMKAD: request.distanceFromMKAD,
        deal_type: request.dealType,
        rangeMaxArea: request.maxArea,
        rangeMinArea: request.minArea,
        rangeMaxPricePerFloor: null,
        rangeMinCeilingHeight: request.minCeilingHeight,
        rangeMaxCeilingHeight: request.maxCeilingHeight,
        heated: request.heated == 0 ? 2 : request.heated,
        has_cranes: request.haveCranes,
        floor_types: request.antiDustOnly ? [2] : [],
        region: request.regions.map((item) => item.region),
        status: 1,
        type_id: [1, 2],
        gates: [],
        direction: request.directions.map((item) => item.direction),
        district_moscow: request.districts.map((item) => item.district),
        firstFloorOnly: request.firstFloorOnly ? 1 : null,
        recommended_sort: null,
      };
      this.queryParams = {
        ...this.$options.defaultQueryParams,
        ...query,
      };
    },
    getFourRecommendedObjects() {
      this.changeRecommendedFilter(4);
      if (!this.recommendedFilter) {
        this.queryParams = this.$options.defaultQueryParams;
        return;
      }
      const request = this.currentRequest;
      const query = {
        rangeMinElectricity: null,
        approximateDistanceFromMKAD: request.distanceFromMKAD,
        deal_type: request.dealType,
        rangeMaxArea: request.maxArea,
        rangeMinArea: request.minArea,
        rangeMaxPricePerFloor: null,
        rangeMinCeilingHeight: request.minCeilingHeight,
        rangeMaxCeilingHeight: request.maxCeilingHeight,
        heated: request.heated == 0 ? 2 : request.heated,
        has_cranes: request.haveCranes,
        floor_types: request.antiDustOnly ? [2] : [],
        region: request.regions.map((item) => item.region),
        status: 2,
        type_id: [1, 2],
        gates: [],
        direction: request.directions.map((item) => item.direction),
        district_moscow: request.districts.map((item) => item.district),
        firstFloorOnly: request.firstFloorOnly ? 1 : null,
        recommended_sort: null,
      };
      this.queryParams = {
        ...this.$options.defaultQueryParams,
        ...query,
      };
    },
    getFiveRecommendedObjects() {
      this.changeRecommendedFilter(5);
      if (!this.recommendedFilter) {
        this.queryParams = this.$options.defaultQueryParams;
        return;
      }
      const request = this.currentRequest;
      const query = {
        rangeMinElectricity: request.electricity,
        approximateDistanceFromMKAD: request.distanceFromMKAD,
        deal_type: 1,
        rangeMaxArea: request.maxArea,
        rangeMinArea: request.minArea,
        rangeMaxPricePerFloor: request.pricePerFloor,
        rangeMinCeilingHeight: request.minCeilingHeight,
        rangeMaxCeilingHeight: request.maxCeilingHeight,
        heated: request.heated == 0 ? 2 : request.heated,
        has_cranes: request.haveCranes,
        floor_types: request.antiDustOnly ? [2] : [],
        region: request.regions.map((item) => item.region),
        status: 1,
        type_id: [1, 2],
        gates: request.gateTypes.map((item) => item.gate_type),
        direction: request.directions.map((item) => item.direction),
        district_moscow: request.districts.map((item) => item.district),
        firstFloorOnly: request.firstFloorOnly ? 1 : null,
        recommended_sort: null,
      };
      this.queryParams = {
        ...this.$options.defaultQueryParams,
        ...query,
      };
    },
    changeRecommendedFilter(filter) {
      if (this.recommendedFilter != filter) {
        this.recommendedFilter = filter;
      } else {
        this.recommendedFilter = null;
      }
    },
    getData() {
      this.getFirstRecommendedObjects();
    },
    async deleteFavoriteOffer() {
      if (this.searchParams.favorites) {
        await this.SEARCH_FAVORITES_OFFERS();
        this.search(this.searchParams, false);
      }
    },
  },
};
</script>

<style>
</style>