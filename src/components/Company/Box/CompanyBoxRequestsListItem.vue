<template>
    <div class="company-item-request" :class="{ done: isDone, active: isActive }">
        <div class="company-item-request__header">
            <span>{{ dealType }}, </span>
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                {{ $formatter.numberOrRangeNew(request.minArea, request.maxArea) }}
            </WithUnitType>
        </div>
        <div class="company-item-request__header">
            <p>{{ status }}</p>
            <div v-if="!readOnly" class="company-item-request__actions">
                <HoverActionsButton
                    v-if="!isDone"
                    @click="$emit('update')"
                    small
                    label="Редактировать"
                >
                    <i class="fa-solid fa-pen" />
                </HoverActionsButton>
                <HoverActionsButton @click="$emit('clone')" small label="Клонировать">
                    <i class="fa-solid fa-clone" />
                </HoverActionsButton>
                <HoverActionsButton
                    v-if="!isDone"
                    @click="$emit('disable')"
                    small
                    :label="isDisabled ? 'Восстановить' : 'Удалить'"
                >
                    <i v-if="isDisabled" class="fa-solid fa-undo" />
                    <i v-else class="fa-solid fa-times" />
                </HoverActionsButton>
            </div>
        </div>
        <div class="company-item-request__location">
            <div class="company-item-request__subject">
                <strong>
                    {{ regions }}
                </strong>
            </div>
            <div v-if="request.directions.length" class="company-item-request__region">
                <p><b>Московская область:</b></p>
                <span>{{ directions }}</span>
            </div>
            <div v-if="request.districts.length" class="company-item-request__region">
                <p><b>Москва:</b></p>
                <span>
                    {{ districts }}
                </span>
            </div>
            <div>
                <p v-if="!request.distanceFromMKADnotApplicable">
                    до {{ request.distanceFromMKAD }} км до МКАД
                </p>
            </div>
            <AccordionSimple class="mt-1" without-render>
                <template #title>
                    <AccordionSimpleTriggerButton />
                </template>
                <template #body>
                    <hr />
                    <div class="company-item-request__parameters">
                        <CompanyBoxRequestsListItemParameter label="Высота потолков">
                            <template #unit-type>(м)</template>
                            <template v-if="!!request.format_ceilingHeight" #extended>
                                <WithUnitType :unit-type="unitTypes.METERS">
                                    {{ request.format_ceilingHeight }}
                                </WithUnitType>
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Площадь пола">
                            <template #unit-type>(м<sup>2</sup>)</template>
                            <template #extended>
                                <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                                    {{
                                        $formatter.numberOrRangeNew(
                                            request.minArea,
                                            request.maxArea
                                        )
                                    }}
                                </WithUnitType>
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Отапливаемый">
                            {{ request.heated ? 'да' : 'нет' }}
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Краны">
                            {{ request.haveCranes ? 'есть' : 'нет' }}
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Только антипыль">
                            {{ request.antiDustOnly ? 'да' : 'нет' }}
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Только 1-й этаж">
                            {{ request.firstFloorOnly ? 'да' : 'нет' }}
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Классы">
                            <template v-if="request.objectClasses?.length">
                                {{ objectClasses }}
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Тип объекта">
                            <template v-if="request.objectTypes?.length" #extended>
                                <div class="d-flex gap-1 flex-wrap">
                                    <UiField
                                        v-for="(element, key) in objectTypes"
                                        :key="key"
                                        :tooltip="element.name"
                                        class="dashboard-bg-success-l"
                                    >
                                        <i :class="element.icon" />
                                    </UiField>
                                </div>
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Ж/Д ветка">
                            {{ request.trainLine ? 'есть' : 'нет' }}
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter
                            v-if="request.trainLine"
                            label="Длина Ж/Д ветки"
                        >
                            <template #unit-type>(м)</template>
                            <template v-if="request.trainLineLength" #extended>
                                <WithUnitType :unit-type="unitTypes.METERS">
                                    {{ request.trainLineLength }}
                                </WithUnitType>
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Дата переезда">
                            <template v-if="request.movingDate">
                                {{ request.movingDate }}
                            </template>
                            <template v-else-if="request.unknownMovingDate !== null">
                                {{ unknownMovingOption }}
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Цена пола">
                            <template #unit-type>(₽)</template>
                            <template v-if="request.pricePerFloor" #extended>
                                <WithUnitType :unit-type="unitTypes.RUB">
                                    {{ $formatter.number(request.pricePerFloor) }}
                                </WithUnitType>
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Электричество">
                            <template #unit-type>(кВт)</template>
                            <template v-if="request.electricity" #extended>
                                <WithUnitType :unit-type="unitTypes.KILOWATT">
                                    {{ $formatter.number(request.electricity) }}
                                </WithUnitType>
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Ворота">
                            <template v-if="request.gateTypes?.length">
                                {{ gateTypes }}
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                        <CompanyBoxRequestsListItemParameter label="Описание">
                            <template v-if="request.description">
                                {{ request.description }}
                            </template>
                        </CompanyBoxRequestsListItemParameter>
                    </div>
                </template>
            </AccordionSimple>
        </div>
        <div class="company-item-request__timeline">
            <p v-if="request.consultant?.userProfile?.short_name">
                конс: <span>{{ request.consultant.userProfile.short_name }}</span>
            </p>
            <p v-if="request.created_at">{{ createdAt }}</p>
            <Progress class="mt-4 mb-2" :percent="request.timeline_progress" title="Обработано" />
            <Button v-if="!readOnly" @click="openTimeline" small>таймлайн</Button>
        </div>
        <div v-if="request.deal" class="company-item-request__footer">
            <AccordionSimple without-render>
                <template #title>
                    <AccordionSimpleTriggerButton :label="dealTitle" />
                </template>
                <template #body>
                    <DealListItem class="mt-1" :deal="request.deal" read-only />
                </template>
            </AccordionSimple>
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
    unknownMovingDate
} from '@/const/const.js';
import { mapGetters } from 'vuex';
import DealListItem from '@/components/Deal/DealListItem.vue';
import Progress from '@/components/common/Progress.vue';
import Button from '@/components/common/Button.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import CompanyBoxRequestsListItemParameter from '@/components/Company/Box/CompanyBoxRequestsListItemParameter.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import { objectPurposesOptions } from '@/const/options/object.options.js';
import UiField from '@/components/common/UI/UiField.vue';

// TODO: MovingDate dayjs format
export default {
    name: 'CompanyBoxRequestsListItem',
    components: {
        UiField,
        AccordionSimpleTriggerButton,
        AccordionSimple,
        CompanyBoxRequestsListItemParameter,
        WithUnitType,
        HoverActionsButton,
        Button,
        DealListItem,
        Progress
    },
    emits: ['update', 'disable', 'clone'],
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
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        unitTypes() {
            return unitTypes;
        },
        dealType() {
            let dealType = DealTypeList[this.request.dealType].label;
            return dealType[0].toUpperCase() + dealType.slice(1);
        },
        status() {
            if (this.isDone) return 'Завершен';
            if (this.isActive) return 'В работе';
            if (this.isDisabled) return 'Пассив';
            return '';
        },
        dealTitle() {
            let company_name =
                this.request.deal.company.nameRu || this.request.deal.company.nameEng;
            return `Сделка: компания ${company_name}, ${this.$formatter.toDate(this.request.deal.dealDate, 'DD.MM.YY')}`;
        },
        isDone() {
            return this.request.status === 2;
        },
        isActive() {
            return this.request.status === 1;
        },
        isDisabled() {
            return this.request.status === 0;
        },
        directions() {
            return this.request.directions
                .map(elem => DirectionList[elem.direction].full)
                .join(', ');
        },
        regions() {
            return this.request.regions
                .map(elem => this.$formatter.text().ucFirst(elem.info.title))
                .join(', ');
        },
        districts() {
            return this.request.districts.map(elem => DistrictList[elem.district]).join(', ');
        },
        objectClasses() {
            return this.request.objectClasses
                .map(elem => ObjectClassList[elem.object_class])
                .join(', ');
        },
        objectTypes() {
            return this.request.objectTypes.map(({ object_type }) => {
                return objectPurposesOptions[object_type];
            });
        },
        unknownMovingOption() {
            return unknownMovingDate[this.request.unknownMovingDate];
        },
        gateTypes() {
            return this.request.gateTypes
                .map(({ gate_type }) => GateTypeList[gate_type])
                .join(', ');
        },
        createdAt() {
            return this.$formatter.toDate(this.request.created_at, 'DD.MM.YYYY, HH:mm');
        }
    },
    methods: {
        openTimeline() {
            this.$router.push({
                query: {
                    request_id: this.request.id,
                    consultant_id: this.THIS_USER.id,
                    step: 0
                }
            });
        }
    }
};
</script>
