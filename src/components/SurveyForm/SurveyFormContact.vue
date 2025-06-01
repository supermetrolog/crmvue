<template>
    <div class="survey-form-contact">
        <SurveyFormContactCard
            @click="$emit('select')"
            @edit="$emit('edit')"
            @show-comments="$emit('show-comments')"
            :completed="isCompleted"
            :active
            :disabled
            :contact
            editable
            class="survey-form-contact__element"
        />
        <AnimationTransition :speed="0.5">
            <div v-if="isCompleted && !active" class="survey-form-contact__result">
                <i class="fa-solid fa-arrow-right-long survey-form-contact__result-arrow"></i>
                <div class="survey-form-contact__block dashboard-bg-success-l">
                    <p>
                        <i class="fa-solid fa-check mr-2" />
                        <span>Обработан</span>
                    </p>
                </div>
                <i class="fa-solid fa-arrow-right-long survey-form-contact__result-arrow"></i>
                <div class="survey-form-contact__block" :class="reasonClass">
                    <p>
                        <i :class="reasonOptionsIcons[form.reason]" class="mr-2" />
                        <span>{{ reasonOptions[form.reason] }}</span>
                        <span v-if="callScheduled" class="ml-1">на {{ callScheduledDate }}</span>
                    </p>
                </div>
            </div>
        </AnimationTransition>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SurveyFormContactCard from '@/components/SurveyForm/SurveyFormContactCard.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import dayjs from 'dayjs';

defineEmits(['edit', 'delete', 'move', 'show-comments', 'select']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    loading: Boolean,
    active: Boolean,
    disabled: Boolean
});

const form = defineModel({ type: Object });

const isCompleted = computed(() => {
    return isNotNullish(form.value?.available) && isNotNullish(form.value?.reason);
});

const callScheduled = computed(() => Number(form.value?.reason) === 6);
const callScheduledDate = computed(() => dayjs(form.value.scheduled).format('DD.MM.YY, HH:mm'));

// form

const isOpened = ref(props.active ?? false);

const stopActiveWatch = watch(
    () => props.active,
    value => {
        if (value) {
            isOpened.value = true;
            stopActiveWatch();
        }
    }
);

const reasonOptions = {
    1: 'Актуален',
    2: 'Будет удален',
    3: 'Будет перенесен',
    4: 'Не поднимает трубку',
    5: 'Телефон недоступен',
    6: 'Запланирован звонок'
};

const reasonOptionsIcons = {
    1: 'fa-solid fa-check',
    2: 'fa-solid fa-trash',
    3: 'fa-solid fa-pen',
    4: 'fa-solid fa-phone-slash',
    5: 'fa-solid fa-phone-slash',
    6: 'fa-solid fa-phone'
};

const reasonClass = computed(() => {
    if (Number(form.value.reason) === 1) return 'dashboard-bg-success-l';
    if (Number(form.value.reason) === 6) return 'dashboard-bg-primary-l';
    return 'dashboard-bg-danger-l';
});
</script>
