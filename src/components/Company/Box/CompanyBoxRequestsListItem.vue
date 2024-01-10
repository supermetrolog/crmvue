<template>
    <div class="company-item-request" :class="{ done: request.status === 2, active: request.status === 1 }">
        <div class="company-item-request__header">
            <p>
                {{ dealType }} {{ request.minArea + ' - ' + request.maxArea }} м<sup><small>2</small></sup>
            </p>
        </div>
        <div class="company-item-request__header">
            <div v-if="!reedOnly" class="company-item-request__actions">
                <i v-if="request.status !== 2" @click="clickUpdateRequest" class="fas fa-pen" title="редактировать"></i>
                <i @click="clickCloneRequest" class="fas fa-clone" title="клонировать"></i>
                <i
                    v-if="request.status !== 2"
                    @click="clickDisableRequest"
                    class="fas"
                    :class="{ 'fa-undo': request.status === 0, 'fa-times': request.status !== 0 }"
                    :title="request.status === 0 ? 'восстановить' : 'удалить'"
                ></i>
            </div>
            <p>{{ status }}</p>
        </div>
        <div class="company-item-request__location">
            <div class="company-item-request__subject">
                <strong>
                    {{ request.regions.map(elem => $formatter.text().ucFirst(elem.info.title)).join(', ') }}
                </strong>
            </div>
            <div v-if="request.directions.length" class="company-item-request__region">
                <p><b>Московская область:</b></p>
                <span>
                    {{
                        request.directions
                            .map(elem => directionList[elem.direction].full)
                            .join(', ')
                    }}
                </span>
            </div>
            <div v-if="request.districts.length" class="company-item-request_region">
                <p><b>Москва:</b></p>
                <span>
                    {{ request.districts.map(elem => districtList[elem.district]).join(', ') }}
                </span>
            </div>
            <div>
                <p v-if="!request.distanceFromMKADnotApplicable">до {{ request.distanceFromMKAD }} км до МКАД</p>
            </div>
            <Dropdown v-model="moreIsOpen" class="more-button" title="Подробнее" />
            <DropdownContainer v-model="moreIsOpen">
                <hr />
                <div class="row company-item-request__parameters">
                    <div class="col-6">
                        <p>отапливаемый</p>
                        <span class="parameters-inner">
                            {{ request.heated ? 'да' : 'нет' }}
                        </span>
                        <p>краны</p>
                        <span class="parameters-inner">
                            {{ request.haveCranes ? 'есть' : 'нет' }}
                        </span>
                        <p>только антипыль</p>
                        <span class="parameters-inner">
                            {{ request.antiDustOnly ? 'да' : 'нет' }}
                        </span>
                        <p>высота потолков <small class="text-grey">(м)</small></p>
                        <span class="parameters-inner">
                            {{ request.format_ceilingHeight }}
                        </span>
                        <p>площадь пола <small class="text-grey">(м<sup>2</sup>)</small></p>
                        <span class="parameters-inner">
                            {{ request.minArea + ' - ' + request.maxArea }}
                        </span>
                        <p>классы</p>
                        <div class="parameters-inner">
                            <span>
                                {{
                                    request.objectClasses
                                        .map(elem => objectClassList[elem.object_class])
                                        .join(', ')
                                }}
                            </span>
                            <span v-if="!request.objectClasses.length">нет данных</span>
                        </div>
                        <p>тип объекта</p>
                        <div v-if="request.objectTypes" class="parameters-inner">
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
                            {{ request.firstFloorOnly ? 'да' : 'нет' }}
                        </span>
                        <p>ж/д ветка</p>
                        <span class="parameters-inner">
                            {{ request.trainLine ? 'есть' : 'нет' }}
                        </span>
                        <span v-if="request.trainLine"> длина ж/д ветки <small class="text-grey">(м)</small> </span>
                        <span v-if="request.trainLine" class="parameters-inner">
                            {{ request.trainLineLength ?? 'нет данных' }}
                        </span>
                        <p>дата переезда</p>
                        <span v-if="request.movingDate" class="parameters-inner">
                            {{ request.movingDate_format }}
                        </span>
                        <span v-if="request.unknownMovingDate !== null" class="parameters-inner">
                            {{ unknownMovingDateOptions[request.unknownMovingDate] }}
                        </span>
                        <p>цена пола <small class="text-grey">(р)</small></p>
                        <span class="parameters-inner">
                            {{ request.pricePerFloor ?? 'нет данных' }}
                        </span>
                        <p>электричество</p>
                        <span class="parameters-inner">
                            {{ request.electricity ?? 'нет данных' }}
                            <small v-if="request.electricity" class="text-grey">(кВт)</small>
                        </span>

                        <p class="font-weight-bold">ворота</p>
                        <div class="parameters-inner">
                            <span v-if="!request.gateTypes.length">нет данных</span>
                            <span v-else>
                                {{
                                    request.gateTypes
                                        .map(elem => gateTypeList[elem.gate_type])
                                        .join(', ')
                                }}
                            </span>
                        </div>
                    </div>
                    <div class="col-12 mt-2">
                        <p>Описание</p>
                        <span class="parameters-inner">
                            {{ request.description ?? 'нет данных' }}
                        </span>
                    </div>
                </div>
            </DropdownContainer>
        </div>
        <div class="company-item-request__timeline">
            <p v-if="request.consultant.userProfile.short_name">
                конс: <span>{{ request.consultant.userProfile.short_name }}</span>
            </p>
            <p v-if="request.created_at">
                {{ dateFormatter(request.created_at) }}
            </p>
            <Progress class="mt-4" :percent="request.timeline_progress" title="Обработано" />
            <Button v-if="!reedOnly" @click="clickTimeline" small>таймлайн</Button>
        </div>
        <div v-if="request.deal" class="company-item-request__footer">
            <Dropdown v-if="request.deal" v-model="dealIsOpen" :title="dealTitle" />
            <DropdownContainer v-model="dealIsOpen">
                <DealListItem :deal="request.deal" :reed-only="true" />
            </DropdownContainer>
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
    unknownMovingDate
} from '@/const/const.js';
import moment from 'moment';
import { mapGetters } from 'vuex';
import Dropdown from '@/components/common/Dropdown/Dropdown.vue';
import DropdownContainer from '@/components/common/Dropdown/DropdownContainer.vue';
import DealListItem from '@/components/Deal/DealListItem.vue';
import Progress from '@/components/common/Progress.vue';
import Button from '@/components/common/Button.vue';

export default {
    name: 'CompanyBoxRequestsListItem',
    components: { Button, DealListItem, DropdownContainer, Dropdown, Progress },
    emits: ['clickUpdateRequest', 'clickDisableRequest', 'clickCloneRequest'],
    props: {
        request: {
            status: Number,
            minArea: Number,
            maxArea: Number,
            regions: Array,
            directions: Array,
            distanceFromMKADnotApplicable: [Number, Boolean],
            distanceFromMKAD: Number,
            heated: Number,
            haveCranes: Number,
            antiDustOnly: Number,
            format_ceilingHeight: String,
            objectClasses: Array,
            objectTypes: Array,
            firstFloorOnly: Number,
            trainLine: Number,
            trainLineLength: Number,
            movingDate_format: String,
            unknownMovingDate: [Number],
            pricePerFloor: Number,
            electricity: [Number, String],
            gateTypes: Array,
            description: String,
            created_at: Number,
            consultant: Object,
            timeline_progress: Number,
            deal: Object,
            default: () => {}
        },
        reedOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dealIsOpen: false,
            moreIsOpen: false
        };
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        dealTypeList: () => DealTypeList,
        directionList: () => DirectionList,
        districtList: () => DistrictList,
        objectTypeListWareHouse: () => ObjectTypeList.warehouse,
        objectTypeListProduction: () => ObjectTypeList.production,
        objectTypeListPlot: () => ObjectTypeList.plot,
        objectClassList: () => ObjectClassList,
        gateTypeList: () => GateTypeList,
        unknownMovingDateOptions: () => unknownMovingDate,
        dealType() {
            let dealType = this.dealTypeList[this.request.dealType].label;
            return dealType[0].toUpperCase() + dealType.slice(1);
        },
        status() {
            if (this.request.status == 2) {
                return 'Завершен';
            }
            if (this.request.status == 1) {
                return 'В работе';
            }
            if (this.request.status == 0) {
                return 'Пассив';
            } else {
                return '';
            }
        },
        dealTitle() {
            let company_name = this.request.deal.company.nameRu || this.request.deal.company.nameEng;
            return `Сделка: компания ${company_name}, ${this.dateFormatter(this.request.deal.dealDate)}`;
        }
    },
    methods: {
        clickTimeline() {
            this.$router.push({
                query: {
                    request_id: this.request.id,
                    consultant_id: this.THIS_USER.id,
                    step: 0
                }
            });
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
        dateFormatter(date) {
            return moment(date).format('DD.MM.YYYY');
        },
        clickUpdateRequest() {
            this.$emit('clickUpdateRequest', this.request);
        },
        clickCloneRequest() {
            this.$emit('clickCloneRequest', this.request);
        },
        clickDisableRequest() {
            this.$emit('clickDisableRequest', this.request);
        }
    }
};
</script>