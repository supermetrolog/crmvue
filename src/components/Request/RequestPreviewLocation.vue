<template>
    <div class="request-preview__box request-preview__location request-preview-location">
        <p class="request-preview__subtitle mb-1">
            <i class="fa-solid fa-earth-europe request-preview-location__icon"></i>
            <span>Локация поиска</span>
        </p>
        <div class="request-preview__table">
            <RequestPreviewLocationRow
                v-for="region in filteredRegions"
                :key="region.id"
                :label="region.info.title"
            >
                -
            </RequestPreviewLocationRow>
            <RequestPreviewLocationRow v-if="hasMoscowCity" label="Москва">
                <span v-if="request.districts.length">
                    {{ districtsText }}
                </span>
                <span v-else>-</span>
            </RequestPreviewLocationRow>
            <RequestPreviewLocationRow v-if="hasMoscowRegion" label="Московская область">
                <span v-if="request.directions.length">
                    {{ directionsText }}
                </span>
                <span v-if="request.directions.length && request.districts.length">,</span>
                <span v-if="!request.distanceFromMKADnotApplicable">
                    до {{ request.distanceFromMKAD }} км от МКАД ({{
                        request.outside_mkad ? 'снаружи' : 'внутри'
                    }}
                    МКАД)
                </span>
                <span v-if="request.region_neardy"> + регионы рядом</span>
                <span
                    v-if="
                        !request.directions.length &&
                        request.distanceFromMKADnotApplicable &&
                        !request.region_neardy
                    "
                >
                    -
                </span>
            </RequestPreviewLocationRow>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { DirectionList, DistrictList } from '@/const/const.js';
import RequestPreviewLocationRow from '@/components/Request/RequestPreviewLocationRow.vue';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const filteredRegions = computed(() => {
    return props.request.regions.filter(
        region => Number(region.region) !== 1 && Number(region.region) !== 6
    );
});

const hasMoscowRegion = computed(() => {
    return props.request.regions.some(region => Number(region.region) === 1);
});

const hasMoscowCity = computed(() => {
    return props.request.regions.some(region => Number(region.region) === 6);
});

const directionsText = computed(() => {
    return props.request.directions
        .map(direction => DirectionList[direction.direction].full)
        .join(', ');
});

const districtsText = computed(() => {
    return props.request.districts.map(district => DistrictList[district.district]).join(', ');
});
</script>
