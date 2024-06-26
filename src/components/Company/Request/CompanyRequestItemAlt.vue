<template>
    <div class="CompanyRequestItemAlt row m-0 py-4 pb-5 px-2">
        <div @click="openCompanyRequestFormForUpdate" class="edit-btn">
            <i class="fas fa-pen m-2 edit"></i>
        </div>
        <div class="col-4">
            <p class="text-danger mb-1">
                {{ dealType.toUpperCase() }}
                {{ request.minArea + ' - ' + request.maxArea }}
                <span>
                    м<sup><small>2</small></sup>
                </span>
            </p>
            <div class="location mb-4">
                <div class="region">
                    <strong>
                        {{
                            request.regions
                                .map(elem => $formatter.text().ucFirst(elem.info.title))
                                .join(', ')
                        }}
                    </strong>
                </div>
                <div v-if="request.directions.length" class="region-parameters">
                    <p class="d-block"><b>Московская область:</b></p>
                    <p>
                        {{
                            request.directions
                                .map(elem => directionList[elem.direction].full)
                                .join(', ')
                        }}
                    </p>
                </div>
                <div v-if="request.districts.length" class="region-parameters">
                    <p class="d-block"><b>Москва:</b></p>
                    <p>
                        {{ request.districts.map(elem => districtList[elem.district]).join(', ') }}
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
                            .map(elem => objectClassList[elem.object_class])
                            .join(',')
                    }}
                </strong>
                <strong v-if="!request.objectClasses.length">нет данных</strong>
            </div>

            <div v-if="request.objectTypes" class="parameters-inner d-flex flex-column">
                <span class="mb-1">Тип объекта</span>
                <div v-if="!!request.objectTypes.length">
                    <strong
                        v-for="objectType of request.objectTypes"
                        :key="objectType.id"
                        class="object-type-box"
                        :title="getObjectTypeName(objectType.object_type)"
                    >
                        <i :class="getObjectTypeIcon(objectType.object_type)"></i>
                    </strong>
                </div>
                <div v-if="!!request.objectTypesGeneral.length">
                    <strong>{{ getObjectTypesGeneral(request.objectTypesGeneral) }}</strong>
                </div>
                <div v-if="!request.objectTypes.length && !request.objectTypesGeneral.length">
                    <p>нет данных</p>
                </div>
            </div>
        </div>
        <div class="col-8 CompanyRequestItemAlt-info-right">
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
                    {{ request.firstFloorOnly ? 'только 1' : 'нет данных' }}
                </strong>
            </div>
            <div class="d-flex">
                <span>Темп. режим</span>
                <strong class="parameters-inner">
                    {{ temperatureHandler }}
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
                    {{ request.antiDustOnly ? 'только антипыль' : 'нет данных' }}
                </strong>
            </div>
            <div class="d-flex mb-4">
                <span>Ворота</span>
                <div>
                    <strong v-if="!request.gateTypes.length">нет данных</strong>
                    <strong v-if="request.gateTypes.length">
                        {{ request.gateTypes.map(elem => gateTypeList[elem.gate_type]).join(', ') }}
                    </strong>
                </div>
            </div>
            <div class="d-flex">
                <span>Электричество</span>
                <strong class="parameters-inner">
                    {{ request.electricity ? `от ${request.electricity} кВт` : 'нет данных' }}
                </strong>
            </div>
            <div class="d-flex">
                <span>Наличие крана</span>
                <strong class="parameters-inner">
                    {{ request.haveCranes ? 'да' : 'нет' }}
                </strong>
            </div>
            <div class="d-flex">
                <span>Ж/д ветка</span>
                <strong class="parameters-inner">
                    {{ request.trainLine ? 'да' : 'нет' }}
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
                {{ request.description ?? 'нет данных' }}
            </strong>
        </div>
    </div>
</template>

<script>
import {
    DealTypeList,
    DirectionList,
    DistrictList,
    GateTypeList,
    ObjectClassList,
    ObjectTypeList,
    ObjectTypesGeneralList,
    PassiveWhyRequest,
    RegionList,
    unknownMovingDate
} from '@/const/const.js';
import { mapGetters } from 'vuex';

export default {
    name: 'CompanyRequestItemAlt',
    emits: ['openCompanyRequestFormForUpdate', 'deleteRequest', 'cloneRequest'],
    props: {
        request: {
            type: Object
        },
        reedOnly: {
            type: Boolean,
            default: false
        },
        editOnly: {
            type: Boolean,
            default: false
        },
        withDeal: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        objectClassList: () => ObjectClassList,
        gateTypeList: () => GateTypeList,
        objectTypesGeneralList: () => ObjectTypesGeneralList,
        objectTypeListWareHouse: () => ObjectTypeList.warehouse,
        objectTypeListProduction: () => ObjectTypeList.production,
        objectTypeListPlot: () => ObjectTypeList.plot,
        regionList: () => RegionList,
        directionList: () => DirectionList,
        districtList: () => DistrictList,
        dealTypeList: () => DealTypeList,
        passiveWhyOptions: () => PassiveWhyRequest,
        unknownMovingDateOptions: () => unknownMovingDate,
        dealType() {
            return this.dealTypeList[this.request.dealType].label;
        },
        temperatureHandler() {
            if (this.request.heated === 0) {
                return 'холодный';
            }
            if (this.request.heated === 1) {
                return 'отапливаемый';
            } else {
                return 'нет данных';
            }
        }
    },
    methods: {
        openCompanyRequestFormForUpdate() {
            this.$emit('openCompanyRequestFormForUpdate', this.request);
        },
        deleteRequest() {
            this.$emit('deleteRequest', this.request);
        },
        cloneRequest() {
            let data = {
                ...this.request
            };
            delete data.id;
            delete data.created_at;
            delete data.updated_at;
            data.status = data.status == 2 ? 1 : data.status;
            this.$emit('cloneRequest', data);
        },
        clickTimeline() {
            this.$router.push({
                query: {
                    request_id: this.request.id,
                    consultant_id: this.THIS_USER.id,
                    step: 0
                }
            });
        },
        getObjectTypesGeneral(types) {
            return types
                .map(type => type.type)
                .map(type => this.objectTypesGeneralList[type])
                .join(', ');
        },
        getObjectTypeIcon(objectType) {
            if (objectType < 12) {
                return this.objectTypeListWareHouse.find(item => item.id == objectType).icon;
            }
            if (objectType < 25) {
                return this.objectTypeListProduction.find(item => item.id == objectType).icon;
            }
            return this.objectTypeListPlot.find(item => item.id == objectType).icon;
        },
        getObjectTypeName(objectType) {
            if (objectType < 12) {
                return this.objectTypeListWareHouse.find(item => item.id == objectType).name;
            }
            if (objectType < 25) {
                return this.objectTypeListProduction.find(item => item.id == objectType).name;
            }
            return this.objectTypeListPlot.find(item => item.id == objectType).name;
        },
        clickOnItem(event) {
            if (this.reedOnly || ['I', 'BUTTON', 'A'].includes(event.target.tagName)) {
                return;
            }

            const query = { ...this.$route.query };
            if (query.selected_request && query.selected_request == this.request.id) {
                delete query.selected_request;
            } else {
                query.selected_request = this.request.id;
            }

            this.$router.replace({ query });
        }
    }
};
</script>

<style></style>
