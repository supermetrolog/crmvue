<template>
    <div class="company-item-request" :class="{ done: isDone, active: isActive }">
        <div class="company-item-request__header">
            <UiTooltipIcon
                v-if="request.expressRequest"
                icon="fa-solid fa-fire"
                tooltip="Срочный запрос"
                class="icon mr-2 text-danger"
            />
            <span>{{ dealType }},</span>
            <WithUnitType class="ml-1" :value="areaRange" :unit-type="unitTypes.SQUARE_METERS" />
        </div>
        <div class="company-item-request__header">
            <p>{{ statusText }}</p>
            <div v-if="!readOnly" class="company-item-request__actions">
                <UiDropdownActions>
                    <template #trigger>
                        <UiButtonIcon
                            icon="fa-solid fa-gear"
                            label="Действия над запросом"
                            small
                            :color="isActive ? 'white' : 'light'"
                        />
                    </template>
                    <template #menu>
                        <UiDropdownActionsButton
                            v-if="!isDone"
                            @handle="$emit('update')"
                            label="Редактировать"
                            icon="fa-solid fa-pen"
                        />
                        <UiDropdownActionsButton
                            v-if="!isDone"
                            @handle="$emit('disable')"
                            :label="isDisabled ? 'Восстановить' : 'В пассив'"
                            :icon="isDisabled ? 'fa-solid fa-undo' : 'fa-solid fa-ban'"
                        />
                        <UiCan moderator-or-higher>
                            <UiDropdownActionsButton
                                v-if="!isDone"
                                @handle="$emit('change-consultant')"
                                label="Изменить консультанта"
                                icon="fa-solid fa-user-tag"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('clone')"
                                label="Клонировать"
                                icon="fa-solid fa-clone"
                            />
                        </UiCan>
                        <UiDropdownActionsButton
                            @handle="openTimeline"
                            label="Открыть таймлайн"
                            icon="fa-solid fa-up-right-from-square"
                        />
                    </template>
                </UiDropdownActions>
            </div>
        </div>
        <div class="company-item-request__location">
            <div class="company-item-request__subject">
                <strong>
                    {{ regionsText }}
                </strong>
            </div>
            <div v-if="request.directions.length" class="company-item-request__region">
                <p><b>Московская область:</b></p>
                <span>{{ directionsText }}</span>
            </div>
            <div v-if="request.districts.length" class="company-item-request__region">
                <p><b>Москва:</b></p>
                <span>
                    {{ districtsText }}
                </span>
            </div>
            <div>
                <p v-if="!request.distanceFromMKADnotApplicable">
                    до {{ request.distanceFromMKAD }} км до МКАД
                </p>
            </div>
        </div>
        <div class="company-item-request__timeline">
            <div v-if="request.consultant" class="d-flex gap-2 align-items-center mb-1">
                <Avatar :size="30" :src="request.consultant.userProfile.avatar" />
                <span>{{ request.consultant.userProfile.short_name }}</span>
            </div>
            <div class="mt-1 mb-2">
                <p v-if="request.related_updated_at" class="fs-2 text-dark">
                    <i class="fa-solid fa-sync mr-1" />
                    <span>{{ relatedUpdatedAt }}</span>
                </p>
                <Progress :percent="request.timeline_progress" title="Обработано" class="mb-1" />
                <UiButton
                    v-if="!readOnly"
                    @click="openTimeline"
                    small
                    icon="fa-solid fa-up-right-from-square"
                    center
                    color="light"
                    tooltip="Открыть таймлайн запроса"
                >
                    Таймлайн
                </UiButton>
            </div>
            <p v-if="request.created_at" class="mt-auto text-dark fs-2">
                <i class="fa-regular fa-clock mr-1" />
                <span>Создан {{ createdAt }}</span>
            </p>
        </div>
        <div class="company-item-request__footer">
            <CompanyBoxRequestsListItemAccordion
                title="Подробнее о запросе"
                :request
                class="mt-1"
            />
            <UiAccordion v-if="request.deal" :title="dealTitle" without-render>
                <template #body>
                    <DealListItem class="mt-1" :deal="request.deal" read-only />
                </template>
            </UiAccordion>
        </div>
    </div>
</template>

<script setup>
import { DealTypeList, DirectionList, DistrictList } from '@/const/const.js';
import DealListItem from '@/components/Deal/DealListItem.vue';
import Progress from '@/components/common/Progress.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiCan from '@/components/common/UI/UiCan.vue';
import { useAuth } from '@/composables/useAuth.js';
import { computed } from 'vue';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import dayjs from 'dayjs';
import { ucFirst } from '@/utils/formatters/string.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import { useRouter } from 'vue-router';
import UiButton from '@/components/common/UI/UiButton.vue';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';
import CompanyBoxRequestsListItemAccordion from '@/components/Company/Box/CompanyBoxRequestsListItemAccordion.vue';
import Avatar from '@/components/common/Avatar.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

defineEmits(['update', 'disable', 'clone', 'change-consultant']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    },
    readOnly: Boolean
});

const dealType = computed(() => DealTypeList[props.request.dealType].label);

const isDisabled = computed(() => props.request.status === 0);
const isActive = computed(() => props.request.status === 1);
const isDone = computed(() => props.request.status === 2);

const statusText = computed(() => {
    if (isDisabled.value) return 'Пассив';
    if (isActive.value) return 'В работе';
    if (isDone.value) return 'Завершен';

    return null;
});

const dealTitle = computed(() => {
    if (!props.request.deal) return null;
    return `Сделка: ${getCompanyShortName(props.request.deal.company)}, ${dayjs(props.request.deal.dealDate).format('D.MM.YY')}`;
});

const directionsText = computed(() => {
    return props.request.directions.map(elem => DirectionList[elem.direction].full).join(', ');
});

const regionsText = computed(() => {
    return props.request.regions.map(elem => ucFirst(elem.info.title)).join(', ');
});

const districtsText = computed(() => {
    return props.request.districts.map(elem => DistrictList[elem.district]).join(', ');
});

const createdAt = computed(() => toBeautifulDateFormat(props.request.created_at, 'D.MM.YY'));

const relatedUpdatedAt = computed(() =>
    toBeautifulDateFormat(props.request.related_updated_at, 'D.MM.YY')
);

const areaRange = computed(() =>
    toNumberOrRangeFormat(props.request.minArea, props.request.maxArea)
);

// timeline

const router = useRouter();
const { currentUserId } = useAuth();

function openTimeline() {
    router.push({
        query: {
            request_id: props.request.id,
            consultant_id: currentUserId.value,
            step: 0
        }
    });
}
</script>
