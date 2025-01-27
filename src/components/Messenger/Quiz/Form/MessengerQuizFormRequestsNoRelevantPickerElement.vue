<template>
    <div class="messenger-quiz-form-request-picker-element" :class="{ disabled: disabled }">
        <div class="messenger-quiz-form-request-picker-element__body">
            <p class="messenger-quiz-form-request-picker-element__header">
                <span
                    v-if="request.expressRequest || true"
                    v-tippy="'Экспресс-запрос'"
                    class="messenger-quiz-form-request-picker-element__express"
                >
                    <i class="fa-solid fa-fire"></i>
                </span>
                <span class="messenger-quiz-form-request-picker-element__id">
                    ID{{ request.id }}
                </span>
                <span
                    class="messenger-quiz-form-request-picker-element__description"
                    :class="{ active: isActive }"
                >
                    <i v-if="isActive" class="fa-solid fa-up-long"></i>
                    <span v-if="dealType" class="messenger-quiz-form-request-picker-element__type">
                        {{ dealType }}
                    </span>
                    <span v-if="request.minArea || request.maxArea">
                        <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                            {{ areaRange }}
                        </with-unit-type>
                    </span>
                </span>
            </p>
            <p v-if="locationText" class="messenger-quiz-form-request-picker-element__regions">
                <Tooltip icon="fa-solid fa-earth-americas">
                    <template #content>
                        <div class="messenger-quiz-form-request-picker-element__location">
                            <p v-if="request.regions">{{ regionsText }}</p>
                            <div v-if="request.directions?.length">
                                <p class="messenger-quiz-form-request-picker-element__subtitle">
                                    Направления МО:
                                </p>
                                <div class="messenger-quiz-form-request-picker-element__list">
                                    <span
                                        v-for="(direction, key) in directions"
                                        :key="key"
                                        class="messenger-quiz-form-request-picker-element__label"
                                    >
                                        {{ direction }}
                                    </span>
                                </div>
                            </div>
                            <div v-if="request.districts?.length">
                                <p class="messenger-quiz-form-request-picker-element__subtitle">
                                    Округа Москвы:
                                </p>
                                <div class="messenger-quiz-form-request-picker-element__list">
                                    <span
                                        v-for="(district, key) in districts"
                                        :key="key"
                                        class="messenger-quiz-form-request-picker-element__label"
                                    >
                                        {{ district }}
                                    </span>
                                </div>
                            </div>
                            <p v-if="request.distanceFromMKAD">
                                До {{ request.distanceFromMKAD }} км до МКАД
                            </p>
                        </div>
                    </template>
                </Tooltip>
                <span>{{ locationText }}</span>
            </p>
            <p v-if="hasActivity" class="messenger-quiz-form-request-picker-element__category">
                {{ categoryName }}
            </p>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import { dealOptions } from '@/const/options/deal.options.js';
import Tooltip from '@/components/common/Tooltip.vue';
import { requestOptions } from '@/const/options/request.options.js';
import { companyOptions } from '@/const/options/company.options.js';
import { locationOptions } from '@/const/options/location.options.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';

const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    disabled: Boolean
});

const isActive = computed(() => props.request.status === requestOptions.statusStatement.ACTIVE);

const hasActivity = computed(() => {
    return (
        props.request?.company &&
        (props.request.company.activityGroup !== null ||
            props.request.company.activityProfile !== null)
    );
});

const categoryName = computed(() => {
    const activityInfo = [
        companyOptions.activityGroup[props.request.company.activityGroup],
        companyOptions.activityProfile[props.request.company.activityProfile]
    ].filter(Boolean);

    return activityInfo.length ? activityInfo.join(': ') : null;
});

const dealType = computed(() => dealOptions.type[props.request.dealType + 1]);

const directions = computed(() => {
    if (!props.request.directions) return [];

    return props.request.directions.map(
        element => locationOptions.directionWithShort[element.direction].full
    );
});

const districts = computed(() => {
    if (!props.request.districts) return [];

    return props.request.districts.map(element => locationOptions.district[element.district]);
});

const regionsText = computed(() => {
    if (!props.request.regions) return '';

    return props.request.regions.map(element => locationOptions.region[element.region]).join(', ');
});

const locationText = computed(() => {
    return [regionsText.value, ...directions.value, ...districts.value].join(', ');
});

const areaRange = computed(() =>
    toNumberOrRangeFormat(props.request.minArea, props.request.maxArea)
);
</script>
