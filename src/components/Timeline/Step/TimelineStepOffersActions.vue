<template>
    <div class="step-action">
        <teleport to="body">
            <Modal
                v-if="sendObjectsModalVisible"
                @close="closeSendObjectsModal"
                title="Отправка"
                class="modal-form-letter"
            >
                <FormLetter
                    @send="sendOffers"
                    @alreadySent="alreadySentOffers"
                    :already-sended="alreadySended"
                    :formdata="sendObjectsFormdata"
                    :loader="loader"
                >
                    <div class="objects">
                        <CompanyObjectsList
                            @select="select"
                            @unSelect="unSelect"
                            @addComment="addComment"
                            :objects="selectedObjects"
                            :selected-objects="selectedObjects"
                            :disabled="true"
                            col="col-3"
                            label="Выбранные предложения"
                        />
                    </div>
                </FormLetter>
            </Modal>
        </teleport>
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row px-2">
                    <div class="col-12"></div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <TimelineStepStage
                                class="mb-2 sticky"
                                title="Шаг 1. Внимательно изучите автоподборки CRM или подберите варианты вручную и отправьте клиенту"
                                :is-done="!!step.timelineStepObjects.length"
                                :close-slot-when-done="false"
                                :is-current="!step.timelineStepObjects.length"
                            >
                                <ButtonList
                                    v-if="!disabled"
                                    @send="openSendObjectsModal(false)"
                                    @alreadySent="openSendObjectsModal(true)"
                                    @negative="negative"
                                    :buttons="buttons"
                                />
                            </TimelineStepStage>
                            <CompanyObjectsList
                                v-if="preventStepObjects && preventStepObjects.length"
                                @select="select"
                                @unSelect="unSelect"
                                @addComment="addComment"
                                :objects="preventStepObjects"
                                :selected-objects="selectedObjects"
                                :disabled="disabled"
                                :loader="loader"
                                :view-mode="viewMode"
                                :current-step-id="step.id"
                                :label="
                                    'Отправленные предложения' +
                                    (preventStepObjects.length
                                        ? ` (${preventStepObjects.length})`
                                        : '')
                                "
                                class="success"
                            />
                            <div
                                class="timeline-actions timeline-list-item row justify-content-end mx-4 mt-4"
                            >
                                <RefreshButton
                                    @click="search(searchParams)"
                                    :disabled="allObjectsLoader"
                                    class="mr-2"
                                />
                                <CustomButton
                                    @confirm="changeRecommendedFilter(1, firstRecommendedQuery)"
                                    :options="{
                                        btnActive: recommendedFilter == 1,
                                        btnClass: 'primary',
                                        defaultBtn: true,
                                        disabled: false
                                    }"
                                    class="d-inline ml-2"
                                >
                                    <template #btnContent>
                                        <span>ЛУЧШЕЕ</span>
                                        <Tooltip :text="firstRecommendedDescription" />
                                    </template>
                                </CustomButton>
                                <CustomButton
                                    @confirm="changeRecommendedFilter(2, twoRecommendedQuery)"
                                    :options="{
                                        btnActive: recommendedFilter == 2,
                                        btnClass: 'primary',
                                        defaultBtn: true,
                                        disabled: false
                                    }"
                                    class="d-inline ml-2"
                                >
                                    <template #btnContent>
                                        <span>СРЕДНЕЕ</span>
                                        <Tooltip :text="twoRecommendedDescription" />
                                    </template>
                                </CustomButton>
                                <CustomButton
                                    @confirm="changeRecommendedFilter(3, threeRecommendedQuery)"
                                    :options="{
                                        btnActive: recommendedFilter == 3,
                                        btnClass: 'warning',
                                        defaultBtn: true,
                                        disabled: false
                                    }"
                                    class="d-inline ml-2"
                                >
                                    <template #btnContent>
                                        <span>ПАССИВ</span>
                                        <Tooltip :text="threeRecommendedDescription" />
                                    </template>
                                </CustomButton>
                            </div>
                            <FormOfferSearch
                                @search="search"
                                @reset="recommendedFilter = null"
                                @resetSelected="reset"
                                :additional-buttons="
                                    selectedObjects.length
                                        ? [
                                              {
                                                  label: 'сбросить выбранное',
                                                  event: 'resetSelected'
                                              }
                                          ]
                                        : []
                                "
                                no-url
                                :query-params="queryParams"
                                class="mb-2 px-4"
                                :class="{ 'action-open': controllPanelHeight > 50 }"
                            />
                            <CompanyObjectsList
                                @select="select"
                                @unSelect="unSelect"
                                @addComment="addComment"
                                @deleteFavoriteOffer="deleteFavoriteOffer"
                                :objects="allObjects"
                                :current-objects="step.timelineStepObjects"
                                :selected-objects="selectedObjects"
                                :disabled="disabled"
                                :loader="allObjectsLoader"
                                :view-mode="viewMode"
                                :pagination="pagination"
                                :current-step-id="step.id"
                            />
                            <Pagination
                                @loadMore="loadMore"
                                :pagination="pagination"
                                class="text-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { LetterSenderMixin, MixinStepActions } from '@/components/Timeline/mixins.js';
import { MixinAllObject } from '@/components/Company/Object/mixins.js';
import CustomButton from '@/components/common/CustomButton.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import { mapGetters } from 'vuex';
import Modal from '@/components/common/Modal.vue';
import FormLetter from '@/components/Forms/FormLetter.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'TimelineStepOffersActions',
    components: {
        Tooltip,
        Pagination,
        FormLetter,
        Modal,
        CustomButton,
        RefreshButton
    },
    mixins: [MixinStepActions, MixinAllObject, LetterSenderMixin],
    data() {
        return {
            recommendedFilter: null,
            queryParams: null,
            alreadySended: false
        };
    },
    // Нужно чтобы сбрасывать лишние фильтры
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
        region_neardy: null,
        outside_mkad: null,
        status: null,
        // new fields
        recommended_sort: null,
        pricePerFloor: null,
        type_id: null,
        firstFloorOnly: null,
        withoutOffersFromQuery: null
    },
    firstRecommendedDescriptionRent: `Учитывается:
      - вид сделки
      - цена +30%
      - площадь
      - направление и регион
      - высота потолков
      - качество пола
      - расстояние от МКАД +30%
      - тип ворот
      - этажность
      - наличие к/б
      - отапливаемость
      - электричество`,
    twoRecommendedDescriptionRent: `Учитывается:
      - вид сделки
      - площадь -20%, +20%
      - высота потолков -2 метра
      - качество пола
      - расстояние от МКАД +30%
      - этажность
      - наличие к/б`,
    threeRecommendedDescriptionRent: `Учитывается:
      - площадь объекта целиком
      - направление и регион
      - расстояние от МКАД +30%`,
    firstRecommendedDescriptionSale: `Учитывается:
      - вид сделки
      - цена +30%
      - площадь -20%, +30%
      - направление и регион
      - высота потолков
      - качество пола
      - расстояние от МКАД +30%
      - тип ворот
      - этажность
      - наличие к/б
      - отапливаемость
      - электричество`,
    twoRecommendedDescriptionSale: `Учитывается:
      - вид сделки
      - цена +50%
      - расстояние от МКАД +50%
      - этажность`,
    threeRecommendedDescriptionSale: `Учитывается:
      - площадь объекта целиком -30%, +30%
      - направление и регион
      - расстояние от МКАД +50%`,
    computed: {
        ...mapGetters(['THIS_USER']),
        firstRecommendedDescription() {
            return this.currentRequest.dealType != 1
                ? this.$options.firstRecommendedDescriptionRent
                : this.$options.firstRecommendedDescriptionSale;
        },
        twoRecommendedDescription() {
            return this.currentRequest.dealType != 1
                ? this.$options.twoRecommendedDescriptionRent
                : this.$options.twoRecommendedDescriptionSale;
        },
        threeRecommendedDescription() {
            return this.currentRequest.dealType != 1
                ? this.$options.threeRecommendedDescriptionRent
                : this.$options.threeRecommendedDescriptionSale;
        },
        firstRecommendedQuery() {
            const request = this.currentRequest;
            const query = {
                rangeMinElectricity: request.electricity,
                rangeMaxDistanceFromMKAD: this.getPercent(request.distanceFromMKAD, 130),
                deal_type: request.dealType,
                rangeMaxArea: request.maxArea,
                rangeMinArea: request.minArea,
                rangeMaxPricePerFloor: this.getPercent(request.pricePerFloor, 130),
                rangeMinCeilingHeight: request.minCeilingHeight,
                heated: request.heated == 0 ? 2 : request.heated,
                has_cranes: request.haveCranes,
                floor_types: request.antiDustOnly ? [2] : [],
                region: request.regions.map(item => item.region),
                status: 1,
                type_id: [1, 2],
                gates: request.gateTypes.map(item => item.gate_type),
                direction: request.directions.map(item => item.direction),
                district_moscow: request.districts.map(item => item.district),
                region_neardy: request.region_neardy,
                outside_mkad: request.outside_mkad,
                firstFloorOnly: request.firstFloorOnly ? 1 : null,
                sort_original_id: this.$route.query.new_original_id ?? null,
                sort: this.$route.query.new_original_id ? '-original_ids' : null
            };
            if (request.dealType == 1) {
                query.rangeMaxArea = this.getPercent(request.maxArea, 130);
                query.rangeMinArea = this.getPercent(request.minArea, 80);
            }
            return query;
        },
        twoRecommendedQuery() {
            const request = this.currentRequest;
            const query = {
                rangeMaxDistanceFromMKAD: this.getPercent(request.distanceFromMKAD, 130),
                deal_type: request.dealType,
                rangeMaxArea: this.getPercent(request.maxArea, 120),
                rangeMinArea: this.getPercent(request.minArea, 80),
                rangeMinCeilingHeight:
                    request.minCeilingHeight > 3
                        ? request.minCeilingHeight - 2
                        : request.minCeilingHeight,
                has_cranes: request.haveCranes,
                floor_types: request.antiDustOnly ? [2] : [],
                status: 1,
                type_id: [1, 2],
                firstFloorOnly: request.firstFloorOnly ? 1 : null,
                withoutOffersFromQuery: JSON.stringify(
                    this.deleteEmptyFields({
                        ...this.firstRecommendedQuery,
                        page: 1,
                        'per-page': 0,
                        expand: 'object,offer,generalOffersMix.offer,comments',
                        timeline_id: this.TIMELINE.id
                    })
                )
            };
            if (request.dealType == 1) {
                query.rangeMaxPricePerFloor = this.getPercent(request.pricePerFloor, 150);
                query.rangeMaxDistanceFromMKAD = this.getPercent(request.distanceFromMKAD, 150);
                delete query.rangeMinCeilingHeight;
                delete query.rangeMaxArea;
                delete query.rangeMinArea;
                delete query.floor_types;
                delete query.has_cranes;
            }
            return query;
        },
        threeRecommendedQuery() {
            const request = this.currentRequest;
            const query = {
                rangeMaxDistanceFromMKAD: this.getPercent(request.distanceFromMKAD, 130),
                rangeMaxArea: request.maxArea,
                rangeMinArea: request.minArea,
                type_id: [3],
                region: request.regions.map(item => item.region),
                direction: request.directions.map(item => item.direction),
                district_moscow: request.districts.map(item => item.district),
                region_neardy: request.region_neardy,
                outside_mkad: request.outside_mkad
            };
            if (request.dealType == 1) {
                query.rangeMaxArea = this.getPercent(request.maxArea, 130);
                query.rangeMinArea = this.getPercent(request.minArea, 70);
            }
            return query;
        }
    },
    methods: {
        openSendObjectsModal(alreadySended = false) {
            this.sendObjectsModalVisible = true;
            this.alreadySended = alreadySended;
        },
        closeSendObjectsModal() {
            this.sendObjectsModalVisible = false;
            this.alreadySended = false;
        },
        updatedObjects(data, fn) {
            this.barVisible = false;
            this.$emit('updatedObjects', data, true, fn);
        },
        getPercent(value, percent) {
            if (!Number.isInteger(value) || !value) {
                return null;
            }

            return Math.floor((value * percent) / 100);
        },
        deleteEmptyFields(object) {
            for (const key in object) {
                if (Object.hasOwnProperty.call(object, key)) {
                    const value = object[key];
                    if (value === null || value === '' || (Array.isArray(value) && !value.length)) {
                        delete object[key];
                    }
                }
            }
            return object;
        },
        changeRecommendedFilter(filter, query) {
            if (this.recommendedFilter != filter) {
                this.recommendedFilter = filter;
            } else {
                this.recommendedFilter = null;
                this.queryParams = this.$options.defaultQueryParams;
                return;
            }

            this.queryParams = {
                ...this.$options.defaultQueryParams,
                ...query
            };
        },
        // Переопределено из миксина чтобы в первую очередь загрузить подборку
        getData() {
            this.changeRecommendedFilter(1, this.firstRecommendedQuery);
        },
        async deleteFavoriteOffer() {
            if (this.searchParams.favorites) {
                await this.SEARCH_FAVORITES_OFFERS();
                this.search(this.searchParams, false);
            }
        }
    }
};
</script>

<style></style>
