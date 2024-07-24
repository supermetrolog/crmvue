<template>
    <Tr>
        <Td class="text-center pr-0">
            {{ request.id }}
        </Td>
        <Td class="request-table__deal" sort="dealType">
            <div class="row no-gutters">
                <div class="col-6">
                    <h4
                        v-if="request.dealType !== null"
                        :class="{ 'text-warning': !request.status }"
                    >
                        {{ dealType }}
                    </h4>
                </div>
                <div class="col-6 text-right">
                    <p
                        v-if="request.expressRequest"
                        class="text-danger d-block"
                        :class="{ 'text-grey': request.status !== 1 }"
                    >
                        <b>срочный запрос</b>
                    </p>
                </div>
                <div class="col-12">
                    <Progress :percent="request.timeline_progress" title="Обработано" />
                </div>
            </div>
        </Td>
        <Td class="text-center request-table__area">
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                <b>{{ $formatter.numberOrRangeNew(request.minArea, request.maxArea) }}</b>
            </WithUnitType>
        </Td>
        <Td class="text-center request-table__price" sort="pricePerFloor">
            <p v-if="request.pricePerFloor !== null">
                <WithUnitType :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR">
                    <b>{{ $formatter.number(request.pricePerFloor) }}</b>
                </WithUnitType>
                <br />
                <WithUnitType :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_MONTH">
                    <b>{{ $formatter.number(request.pricePerFloorMonth) }}</b>
                </WithUnitType>
            </p>
            <p v-else>&#8212;</p>
        </Td>
        <Td class="text-center py-1">
            <div>
                <p v-if="request.regions.length">
                    {{ regionsText }}
                </p>
                <p v-else>&#8212;</p>
                <div v-if="request.directions.length">
                    <p class="d-inline"><b>Московская область: </b></p>
                    <p class="d-inline">
                        {{ directionsText }}
                    </p>
                </div>
                <div v-if="request.districts.length">
                    <p class="d-inline"><b>Москва: </b></p>
                    <p class="d-inline">
                        {{ districtsText }}
                    </p>
                </div>
                <p v-if="!request.distanceFromMKADnotApplicable">
                    до {{ request.distanceFromMKAD }} км до МКАД
                </p>
            </div>
        </Td>
        <Td class="text-center">
            <a :href="$url.company(request.company.id)" target="_blank" class="text-primary">
                <p :class="{ 'text-warning': !request.company.status }">
                    {{ request.company.full_name }}
                </p>
            </a>
        </Td>
        <Td class="text-center">
            <p v-if="request.consultant">
                {{ request.consultant.userProfile.short_name }}
            </p>
            <p v-else>&#8212;</p>
        </Td>
        <Td class="text-center request-table__date" sort="updated_at">
            <p>
                {{ request.updated_at_format ?? request.created_at_format }}
            </p>
        </Td>
        <Td class="text-center request-table__status" sort="status">
            <h4 v-if="request.status === 1" class="text-success">Актив</h4>
            <span
                v-else-if="request.status === 2"
                class="request-table__badge badge badge-blue-green"
            >
                Завершен
            </span>
            <span v-else class="request-table__badge badge badge-warning">Пассив</span>
            <div v-if="!request.status" class="request-table__passive-why">
                <p class="text-warning d-inline-block">
                    <b>{{ passiveWhy }}</b>
                    <span v-if="request.passive_why_comment" class="text-dark">
                        : {{ request.passive_why_comment }}
                    </span>
                </p>
            </div>
        </Td>
    </Tr>
</template>

<script setup>
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import Progress from '@/components/common/Progress.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { ucFirst } from '@/utils/formatter.js';
import { DealTypeList, DirectionList, DistrictList, PassiveWhyRequest } from '@/const/const.js';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const regionsText = computed(() =>
    props.request.regions.map(elem => ucFirst(elem.info.title)).join(', ')
);
const directionsText = computed(() =>
    props.request.directions.map(elem => DirectionList[elem.direction].full).join(', ')
);
const districtsText = computed(() =>
    props.request.districts.map(elem => DistrictList[elem.district]).join(', ')
);
const dealType = computed(() => DealTypeList[props.request.dealType].label);
const passiveWhy = computed(() => PassiveWhyRequest[props.request.passive_why].label);
</script>
