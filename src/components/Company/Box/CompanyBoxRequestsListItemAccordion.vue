<template>
    <UiAccordion title="Подробнее" without-render>
        <template #body>
            <hr />
            <div class="company-item-request__parameters">
                <CompanyBoxRequestsListItemParameter label="Высота потолков">
                    <template #unit-type>(м)</template>
                    <template #extended>
                        <WithUnitType :value="formatCeilingHeight" :unit-type="unitTypes.METERS" />
                    </template>
                </CompanyBoxRequestsListItemParameter>
                <CompanyBoxRequestsListItemParameter label="Площадь пола">
                    <template #unit-type>(м<sup>2</sup>)</template>
                    <template #extended>
                        <WithUnitType :value="areaRange" :unit-type="unitTypes.SQUARE_METERS" />
                    </template>
                </CompanyBoxRequestsListItemParameter>
                <CompanyBoxRequestsListItemParameter :value="request.heated" label="Отапливаемый" />
                <CompanyBoxRequestsListItemParameter :value="request.haveCranes" label="Краны" />
                <CompanyBoxRequestsListItemParameter
                    :value="request.antiDustOnly"
                    label="Только антипыль"
                />
                <CompanyBoxRequestsListItemParameter
                    :value="request.firstFloorOnly"
                    label="Только 1-й этаж"
                />
                <CompanyBoxRequestsListItemParameter label="Классы">
                    <template v-if="request.objectClasses?.length">
                        {{ objectClassesText }}
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
                <CompanyBoxRequestsListItemParameter :value="request.trainLine" label="Ж/Д ветка" />
                <CompanyBoxRequestsListItemParameter
                    v-if="request.trainLine"
                    label="Длина Ж/Д ветки"
                >
                    <template #unit-type>(м)</template>
                    <template v-if="request.trainLineLength" #extended>
                        <WithUnitType
                            :value="request.trainLineLength"
                            :unit-type="unitTypes.METERS"
                        />
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
                        <WithUnitType :value="pricePerFloor" :unit-type="unitTypes.RUB" />
                    </template>
                </CompanyBoxRequestsListItemParameter>
                <CompanyBoxRequestsListItemParameter label="Электричество">
                    <template #unit-type>(кВт)</template>
                    <template v-if="request.electricity" #extended>
                        <WithUnitType :value="electricity" :unit-type="unitTypes.KILOWATT" />
                    </template>
                </CompanyBoxRequestsListItemParameter>
                <CompanyBoxRequestsListItemParameter label="Ворота">
                    <template v-if="request.gateTypes?.length">
                        {{ gateTypesText }}
                    </template>
                </CompanyBoxRequestsListItemParameter>
                <CompanyBoxRequestsListItemParameter label="Описание">
                    <template v-if="request.description">
                        {{ request.description }}
                    </template>
                </CompanyBoxRequestsListItemParameter>
            </div>
        </template>
    </UiAccordion>
</template>

<script setup>
import { GateTypeList, ObjectClassList, unknownMovingDate } from '@/const/const.js';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import CompanyBoxRequestsListItemParameter from '@/components/Company/Box/CompanyBoxRequestsListItemParameter.vue';
import { objectPurposesOptions } from '@/const/options/object.options.js';
import UiField from '@/components/common/UI/UiField.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { computed } from 'vue';
import { toNumberFormat, toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const objectClassesText = computed(() => {
    return props.request.objectClasses.map(elem => ObjectClassList[elem.object_class]).join(', ');
});

const objectTypes = computed(() => {
    return props.request.objectTypes.map(({ object_type }) => {
        return objectPurposesOptions[object_type];
    });
});

const unknownMovingOption = computed(() => unknownMovingDate[props.request.unknownMovingDate]);

const gateTypesText = computed(() => {
    return props.request.gateTypes.map(({ gate_type }) => GateTypeList[gate_type]).join(', ');
});

const formatCeilingHeight = computed(() => {
    if (isNotNullish(props.request.maxCeilingHeight))
        return `${props.request.minCeilingHeight} - ${props.request.maxCeilingHeight}`;
    return `от ${props.request.minCeilingHeight}`;
});

const pricePerFloor = computed(() => toNumberFormat(props.request.pricePerFloor));

const areaRange = computed(() =>
    toNumberOrRangeFormat(props.request.minArea, props.request.maxArea)
);

const electricity = computed(() => toNumberFormat(props.request.electricity));
</script>
