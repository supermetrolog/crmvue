<template>
    <div class="timeline-step">
        <teleport to="body">
            <Modal
                @close="closeSendingModal"
                :show="sendModalIsVisible"
                title="Отправка объектов клиенту"
                width="1200"
            >
                <FormLetter
                    @send="sendNewObjects"
                    @alreadySent="alreadySentObjects"
                    :already-sended="isAlreadySent"
                    :formdata="preparedLetterMessage"
                    :disabled="!selectedObjects.length"
                >
                    <CompanyObjectsList
                        @select="select"
                        @unselect="unselect"
                        @addComment="addComment"
                        :objects="selectedObjects"
                        :selected-objects="selectedObjects"
                        disabled
                        col="col-3"
                        label="Выбранные предложения"
                    />
                </FormLetter>
            </Modal>
        </teleport>
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="Предложение возможных вариантов"
                    :success="step.status === 1"
                >
                    <p>
                        Внимательно изучите автоподборки CRM или подберите варианты вручную и
                        отправьте клиенту
                    </p>
                    <template #footer>
                        <div class="d-flex gap-2">
                            <Button
                                v-tippy="'Отправить презентации с объектами клиенту'"
                                @click="sendModalIsVisible = true"
                                success
                                solid
                                :disabled="!selectedObjects.length || disabled"
                                icon
                            >
                                <span>
                                    <span>Отправить</span>
                                    <span v-if="selectedObjects.length">
                                        ({{ selectedObjectsCount }})
                                    </span>
                                </span>
                                <i class="fa-solid fa-paper-plane icon"></i>
                            </Button>
                            <Button
                                v-tippy="'Уже отправил предложения другим способом'"
                                @click="selectAlreadySent"
                                :active="data.negative"
                                :disabled="!selectedObjects.length || disabled"
                                solid
                                icon
                            >
                                <span>
                                    <span>Отметить как отправленные</span>
                                    <span v-if="selectedObjects.length">
                                        ({{ selectedObjectsCount }})
                                    </span>
                                </span>
                                <i class="fa-solid fa-envelope-circle-check icon"></i>
                            </Button>
                            <Button
                                @click="selectNegative"
                                danger
                                :active="data.negative"
                                :disabled="disabled"
                                solid
                                icon
                            >
                                <span>Нет подходящих</span>
                                <i class="fa-solid fa-frown-open icon"></i>
                            </Button>
                        </div>
                    </template>
                </TimelineInfo>
            </div>
            <div class="col-12">
                <CompanyObjectsList
                    v-if="preventStepObjects?.length"
                    @select="select"
                    @unselect="unselect"
                    @addComment="addComment"
                    :objects="preventStepObjects"
                    :selected-objects="selectedObjects"
                    :disabled="disabled"
                    :loader="isDefaultLoading"
                    :view-mode="viewMode"
                    :current-step-id="step.id"
                    :label="
                        'Отправленные предложения' +
                        (preventStepObjects.length ? ` (${preventStepObjects.length})` : '')
                    "
                    class="alt mb-2"
                />
                <div class="d-flex gap-1 justify-content-end">
                    <RefreshButton @click="refresh" :disabled="isSearchLoading" class="mr-2" />
                    <Button
                        @click="changeRecommendedFilter(1, totalRecommendedQuery)"
                        :active="currentRecommendedFilter === 1"
                        icon
                    >
                        <span>Лучшее</span>
                        <Tooltip>
                            <template #content>
                                <TimelineSearchRecommendations
                                    :recommendations="recommendations[dealTypeKey].TOTAL"
                                />
                            </template>
                        </Tooltip>
                    </Button>
                    <Button
                        @click="changeRecommendedFilter(2, mediumRecommendedQuery)"
                        :active="currentRecommendedFilter === 2"
                        icon
                    >
                        <span>Среднее</span>
                        <Tooltip>
                            <template #content>
                                <TimelineSearchRecommendations
                                    :recommendations="recommendations[dealTypeKey].MEDIUM"
                                />
                            </template>
                        </Tooltip>
                    </Button>
                    <Button
                        @click="changeRecommendedFilter(3, liteRecommendedQuery)"
                        :active="currentRecommendedFilter === 3"
                        warning
                        icon
                    >
                        <span>Пассив</span>
                        <Tooltip>
                            <template #content>
                                <TimelineSearchRecommendations
                                    :recommendations="recommendations[dealTypeKey].LITE"
                                />
                            </template>
                        </Tooltip>
                    </Button>
                </div>
                <FormOfferSearch
                    @search="search"
                    @reset="currentRecommendedFilter = null"
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
                    :class="{ 'action-open': controlPanelHeight > 50 }"
                />
                <CompanyObjectsList
                    @select="select"
                    @unselect="unselect"
                    @addComment="addComment"
                    @deleteFavoriteOffer="deleteFavoriteOffer"
                    :objects="objects"
                    :current-objects="step.timelineStepObjects"
                    :selected-objects="selectedObjects"
                    :disabled="disabled"
                    :loader="isSearchLoading"
                    :view-mode="viewMode"
                    :pagination="pagination"
                    :current-step-id="step.id"
                />
                <Pagination @load-more="loadMore" :pagination="pagination" class="text-center" />
            </div>
        </div>
    </div>
</template>

<script>
import {
    TimelineStepWithLetterMixin,
    TimelineStepWithSearchableObjectsMixin
} from '@/components/Timeline/mixins.js';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import Button from '@/components/common/Button.vue';
import Modal from '@/components/common/Modal.vue';
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import FormLetter from '@/components/Forms/FormLetter.vue';
import plural from 'plural-ru';
import RefreshButton from '@/components/common/RefreshButton.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import Tooltip from '@/components/common/Tooltip.vue';
import FormOfferSearch from '@/components/Forms/Offer/FormOfferSearch.vue';
import { entityOptions } from '@/const/options/options.js';
import { deleteEmptyFields } from '@/utils/deleteEmptyFields.js';
import { TimelineRecommendedDescriptions } from '@/const/const.js';
import TimelineSearchRecommendations from '@/components/Timeline/TimelineSearchRecommedations.vue';

export default {
    name: 'TimelineStepOffers',
    components: {
        TimelineSearchRecommendations,
        FormOfferSearch,
        Tooltip,
        Pagination,
        RefreshButton,
        FormLetter,
        CompanyObjectsList,
        Modal,
        Button,
        TimelineInfo
    },
    mixins: [TimelineStepWithSearchableObjectsMixin, TimelineStepWithLetterMixin],
    data() {
        return {
            selectedObjects: [],
            isAlreadySent: false,
            currentRecommendedFilter: null,
            queryParams: null
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
    computed: {
        selectedObjectsCount() {
            return plural(this.selectedObjects.length, '%d объект', '%d объекта', '%d объектов');
        },
        dealTypeKey() {
            if (this.currentRequest.dealType + 1 === entityOptions.deal.typeStatement.SALE)
                return 'SALE';
            return 'RENT';
        },
        recommendations: () => TimelineRecommendedDescriptions,
        totalRecommendedQuery() {
            const request = this.currentRequest;
            const query = {
                rangeMinElectricity: request.electricity,
                rangeMaxDistanceFromMKAD: this.getPercent(request.distanceFromMKAD, 130),
                deal_type: request.dealType,
                rangeMaxArea: request.maxArea,
                rangeMinArea: request.minArea,
                rangeMaxPricePerFloor: this.getPercent(request.pricePerFloor, 130),
                rangeMinCeilingHeight: request.minCeilingHeight,
                heated: request.heated === 0 ? 2 : request.heated,
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
            if (request.dealType + 1 === entityOptions.deal.typeStatement.SALE) {
                query.rangeMaxArea = this.getPercent(request.maxArea, 130);
                query.rangeMinArea = this.getPercent(request.minArea, 80);
            }
            return query;
        },
        mediumRecommendedQuery() {
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
                    deleteEmptyFields(
                        {
                            ...this.totalRecommendedQuery,
                            page: 1,
                            'per-page': 0,
                            expand: 'object,offer,generalOffersMix.offer,comments',
                            timeline_id: this.TIMELINE.id
                        },
                        true
                    )
                )
            };
            if (request.dealType + 1 === entityOptions.deal.typeStatement.SALE) {
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
        liteRecommendedQuery() {
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
            if (request.dealType + 1 === entityOptions.deal.typeStatement.SALE) {
                query.rangeMaxArea = this.getPercent(request.maxArea, 130);
                query.rangeMinArea = this.getPercent(request.minArea, 70);
            }
            return query;
        }
    },
    methods: {
        selectNegative() {
            this.data.negative ? (this.data.negative = 0) : (this.data.negative = 1);
            this.$emit('update-step', this.data);
        },
        selectAlreadySent() {
            this.isAlreadySent = true;
            this.sendModalIsVisible = true;
        },
        closeSendingModal() {
            this.sendModalIsVisible = false;
            this.isAlreadySent = false;
        },
        getPercent(value, percent) {
            if (!Number.isInteger(value) || !value) return null;
            return Math.floor((value * percent) / 100);
        },
        changeRecommendedFilter(filter, query) {
            if (this.currentRecommendedFilter === filter) {
                this.currentRecommendedFilter = null;
                this.queryParams = this.$options.defaultQueryParams;
                return;
            }

            this.currentRecommendedFilter = filter;
            this.queryParams = {
                ...this.$options.defaultQueryParams,
                ...query
            };
        },
        fetchData() {
            this.changeRecommendedFilter(1, this.totalRecommendedQuery);
        },
        async deleteFavoriteOffer() {
            if (this.searchParams.favorites) {
                await this.SEARCH_FAVORITES_OFFERS();
                this.search(this.searchParams, false);
            }
        },
        async sendNewObjects(event) {
            await this.send(event);
            this.$emit('next-step');
        },
        async alreadySentObjects(event) {
            const sendingSuccessfully = await this.alreadySent(event);
            if (sendingSuccessfully) this.$emit('next-step');
        }
    }
};
</script>

<style></style>
