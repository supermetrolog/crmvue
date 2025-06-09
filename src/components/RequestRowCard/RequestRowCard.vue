<template>
    <div class="request-row-card">
        <div class="request-row-card__except">
            <div class="request-row-card__column">
                <p class="request-row-card__id">#{{ request.id }}</p>
                <Avatar
                    v-if="request.consultant"
                    :src="request.consultant.userProfile.avatar"
                    :size="40"
                />
                <UiDropdownActions v-if="$slots.menu">
                    <template #trigger>
                        <UiDropdownActionsTrigger
                            label="Действия над запросом"
                            color="light"
                            class="op-7"
                        />
                    </template>
                    <template #menu>
                        <slot name="menu" />
                    </template>
                </UiDropdownActions>
            </div>
            <div class="request-row-card__info">
                <p class="font-weight-bold">{{ dealType }}</p>
                <WithUnitType
                    :value="areaRange"
                    :unit-type="unitTypes.SQUARE_METERS"
                    class="font-weight-bold mb-1"
                />
                <p class="request-row-card__location">
                    <i class="fa-solid fa-earth mr-1"></i>
                    <span v-if="locationText.length">{{ locationText }}</span>
                    <span v-else>Неизвестно</span>
                </p>
                <div class="request-row-card__date">Создан {{ createdAt }}</div>
            </div>
        </div>
        <div class="request-row-card__body">
            <div class="request-row-card__header">
                <div class="request-row-card__description">
                    <p v-if="request.description?.length">{{ request.description }}</p>
                    <p v-else>Без комментария..</p>
                </div>
                <slot name="actions" />
            </div>
            <div
                class="request-row-card__footer"
                :class="{ 'request-row-card__footer--empty': !fullRequest?.timeline }"
            >
                <Spinner v-if="isLoading" class="absolute-center" small />
                <div v-else-if="fullRequest?.timeline" class="request-row-card__timeline">
                    <RequestRowCardTimelineStep
                        v-for="step in timelineSteps"
                        :key="step.id"
                        :definition="step"
                        :origin="fullRequest.timeline.steps[step.id]"
                    />
                </div>
                <div
                    v-else
                    class="request-row-card__timeline align-items-center justify-content-center"
                >
                    <UiField color="light">Таймлайн отсутствует..</UiField>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onBeforeMount, ref, shallowRef } from 'vue';
import { unitTypes } from '@/const/unitTypes.js';
import Avatar from '@/components/common/Avatar.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsTrigger from '@/components/common/UI/DropdownActions/UiDropdownActionsTrigger.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import { locationOptions } from '@/const/options/location.options.js';
import { toDateFormat } from '@/utils/formatters/date.js';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import UiField from '@/components/common/UI/UiField.vue';
import RequestRowCardTimelineStep from '@/components/RequestRowCard/RequestRowCardTimelineStep.vue';

const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const timelineSteps = [
    {
        id: 0,
        visual_id: '1',
        name: 'Meeting',
        label: 'Знакомство с клиентом',
        shortLabel: 'Знакомство',
        icon: 'fa-solid fa-phone-alt',
        checkPause: point => point.negative === 1,
        steps: [
            {
                id: 0,
                visual_id: '1.1',
                name: 'MeetingActivity',
                label: 'Изучение деятельности',
                doneLabel: 'Компания проверена',
                pauseLabel: 'Шаг на паузе',
                processLabel: 'Изучите компанию!',
                checkDone: point => point.additional === 1 || point.status === 1,
                checkPause: point => point.negative === 1 && point.additional !== 1
            },
            {
                id: 1,
                visual_id: '1.2',
                name: 'MeetingConfirmation',
                label: 'Подтверждение запроса',
                doneLabel: 'Запрос подтвержден',
                pauseLabel: 'Шаг на паузе',
                processLabel: 'Подтвердите запрос!',
                checkDone: point => point.status === 1,
                checkPause: point => point.negative === 1 && point.additional === 1,
                checkDisable: point =>
                    point.negative === 1 && point.additional === 0 && point.status !== 1
            }
        ]
    },
    {
        id: 1,
        visual_id: '2',
        name: 'Offers',
        label: 'Предложение',
        icon: 'fa-solid fa-city',
        doneLabel: 'Предложения отправлены',
        pauseLabel: 'Шаг на паузе',
        processLabel: 'Подберите предложение!'
    },
    {
        id: 2,
        visual_id: '3',
        name: 'Feedback',
        label: 'Обратная связь',
        icon: 'fa-solid fa-bullhorn',
        steps: [
            {
                id: 0,
                name: 'FeedbackInterest',
                label: 'Интерес клиента',
                visual_id: '3.1',
                doneLabel: 'Связь получена',
                pauseLabel: 'Шаг на паузе',
                processLabel: 'Опросите по вариантам!',
                checkDone: point => point.objects.length > 0
            },
            {
                id: 1,
                visual_id: '3.2',
                name: 'FeedbackCommunication',
                label: 'Способ связи',
                doneLabel: 'Способ связи указан',
                pauseLabel: 'Шаг на паузе',
                processLabel: 'Укажите способ связи!',
                checkDone: point => point.feedback_ways.length > 0
            }
        ]
    },
    {
        id: 3,
        visual_id: '4',
        name: 'Inspection',
        label: 'Организация показов',
        shortLabel: 'Осмотр',
        icon: 'fa-solid fa-map-location-dot',
        doneLabel: 'Показ организован',
        pauseLabel: 'Шаг на паузе',
        processLabel: 'Организуйте показ!',
        checkDone: point => point.objects.length > 0
    },
    {
        id: 6,
        visual_id: '5',
        name: 'Talk',
        label: 'Переговоры',
        icon: 'fa-solid fa-comments-dollar',
        doneLabel: 'Переговоры проведены',
        pauseLabel: 'Шаг на паузе',
        processLabel: 'Подготовьтесь к переговорам!'
    },
    {
        id: 7,
        visual_id: '6',
        name: 'Deal',
        label: 'Сделка',
        icon: 'fa-regular fa-handshake',
        steps: [
            {
                id: 0,
                visual_id: '6.1',
                name: 'DealDecision',
                label: 'Решение по объекту',
                doneLabel: 'Решение вынесено',
                pauseLabel: 'Шаг на паузе',
                processLabel: 'Узнайте решение клиента!',
                checkDone: point => point.objects.length > 0
            },
            {
                id: 1,
                visual_id: '6.2',
                name: 'DealConfirmation',
                label: 'Заключение сделки',
                doneLabel: 'Сделка заключена',
                pauseLabel: 'Шаг на паузе',
                processLabel: 'Оформите сделку!',
                checkDone: point => point.status === 1
            }
        ]
    }
];

const dealType = computed(() => dealOptions.type[props.request.dealType + 1]);

const areaRange = computed(() =>
    toNumberOrRangeFormat(props.request.minArea, props.request.maxArea)
);

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
    const locations = [regionsText.value, ...directions.value, ...districts.value];

    if (props.request.distanceFromMKAD) {
        locations.push(`до ${props.request.distanceFromMKAD} км до МКАД`);
    }

    return locations.join(', ');
});

const createdAt = computed(() => toDateFormat(props.request.created_at, 'D.MM.YYг.'));

const fullRequest = shallowRef(null);
const isLoading = ref(false);

async function fetchFulLRequest() {
    isLoading.value = true;

    fullRequest.value = await api.request.get(props.request.id);

    isLoading.value = false;
}

onBeforeMount(fetchFulLRequest);
</script>
