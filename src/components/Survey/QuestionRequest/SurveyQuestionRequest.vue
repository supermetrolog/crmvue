<template>
    <div class="messenger-quiz-form-request-picker-element">
        <div class="messenger-quiz-form-request-picker-element__body">
            <p class="messenger-quiz-form-request-picker-element__header">
                <span
                    v-if="request.expressRequest"
                    v-tippy="'Экспресс-запрос'"
                    class="messenger-quiz-form-request-picker-element__express"
                >
                    <i class="fa-solid fa-fire"></i>
                </span>
                <span class="messenger-quiz-form-request-picker-element__id">
                    #{{ request.id }}
                </span>
                <span
                    class="messenger-quiz-form-request-picker-element__description"
                    :class="{ active: isActive }"
                >
                    <i v-if="isActive" class="fa-solid fa-up-long"></i>
                    <span v-if="dealType" class="messenger-quiz-form-request-picker-element__type">
                        {{ dealType }},
                    </span>
                    <span v-if="request.minArea || request.maxArea">
                        <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                            {{ areaRange }}
                        </with-unit-type>
                    </span>
                </span>
                <span v-if="request.name">
                    <span class="mr-1">|</span>
                    <span>{{ request.name }}</span>
                </span>
                <UiButtonIcon
                    v-if="editable"
                    @click="$emit('edit')"
                    class="messenger-quiz-form-request-picker-element__edit"
                    small
                    label="Редактировать"
                    icon="fa-solid fa-pen"
                />
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
                <span>
                    <span>{{ locationText }},</span>
                    <span v-if="request.distanceFromMKAD">
                        до {{ request.distanceFromMKAD }} км до МКАД
                    </span>
                </span>
            </p>
            <p class="text-grey">Описание:</p>
            <div v-if="request.description" v-html="request.description"></div>
            <p v-else>Не заполнено</p>
            <div class="d-flex justify-content-between align-items-end">
                <span
                    v-if="hasActivity"
                    class="messenger-quiz-form-request-picker-element__category"
                >
                    {{ categoryName }}
                </span>
                <span class="flex-shrink-0">Создан {{ createdAt }}</span>
            </div>
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
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import { ucFirst } from '@/utils/formatters/string.js';

defineEmits(['edit']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    editable: Boolean
});

const isActive = computed(() => props.request.status === requestOptions.statusStatement.ACTIVE);

const hasActivity = computed(() => {
    return (
        props.request?.company &&
        (props.request.company.activity_profiles?.length ||
            props.request.company.activity_groups?.length ||
            isNotNullish(props.request.company.activityGroup) ||
            isNotNullish(props.request.company.activityProfle))
    );
});

const categoryName = computed(() => {
    if (
        props.request.company.activity_profiles?.length ||
        props.request.company.activity_groups?.length
    ) {
        return [
            props.request.company.activity_groups
                .map(el => companyOptions.activityGroup[el.activity_group_id])
                .join(', '),
            props.request.company.activity_profiles
                .map(el => companyOptions.activityProfile[el.activity_profile_id])
                .join(', ')
        ].join(': ');
    }

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

    return props.request.regions.map(element => ucFirst(element.info.title)).join(', ');
});

const locationText = computed(() => {
    return [regionsText.value, ...directions.value, ...districts.value].join(', ');
});

const areaRange = computed(() =>
    toNumberOrRangeFormat(props.request.minArea, props.request.maxArea)
);

const createdAt = computed(() => toDateFormat(props.request.created_at, 'D.MM.YYг.'));
</script>
