<template>
    <div class="survey-form-contact">
        <div class="survey-form-contact__row">
            <SurveyFormContactCard
                @click="$emit('select')"
                @edit="$emit('edit')"
                @show-comments="$emit('show-comments')"
                @schedule-call="$emit('schedule-call')"
                :completed="isCompleted"
                :active
                :disabled
                :contact
                :editable
                :full
                :scheduled="form.scheduled"
                :most-callable
                class="survey-form-contact__element"
            />
            <AnimationTransition :speed="0.5">
                <div v-if="isCompleted" class="survey-form-contact__result">
                    <i class="fa-solid fa-arrow-right-long survey-form-contact__result-arrow"></i>
                    <div class="survey-form-contact__block dashboard-bg-success-l">
                        <p>
                            <i class="fa-solid fa-check mr-2" />
                            <span>Обработан</span>
                        </p>
                    </div>
                    <i class="fa-solid fa-arrow-right-long survey-form-contact__result-arrow"></i>
                    <div class="d-flex flex-column gap-1 flex-shrink-0">
                        <div class="survey-form-contact__block" :class="reasonClass">
                            <p>
                                <i :class="reasonOptionsIcons[form.reason]" class="mr-2" />
                                <span>{{ reasonOptions[form.reason] }}</span>
                            </p>
                        </div>
                        <div
                            v-if="form.scheduled"
                            class="survey-form-contact__block dashboard-bg-success-l"
                        >
                            <p>
                                <i class="mr-2 fa-solid fa-phone" />
                                <span>Звонок</span>
                                <span v-if="form.scheduled" class="ml-1">
                                    {{ callScheduledDate }}
                                </span>
                            </p>
                        </div>
                    </div>
                    <template v-if="descriptionShouldBeVisible">
                        <i
                            class="fa-solid fa-arrow-right-long survey-form-contact__result-arrow"
                        ></i>
                        <div class="survey-form-contact__description fs-2">
                            <p class="fs-1 text-grey">
                                <i>Задача {{ currentUser.userProfile.middle_name }} => Еськова</i>
                            </p>
                            <i>{{ form.description }}</i>
                        </div>
                    </template>
                </div>
            </AnimationTransition>
        </div>
        <AnimationTransition :speed="0.5">
            <SurveyFormContactForm
                v-if="active"
                v-model="form"
                @close="$emit('close')"
                @change="$emit('change')"
                @schedule-call="$emit('schedule-call')"
                :contact
                class="mt-2 mb-4"
            />
        </AnimationTransition>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SurveyFormContactCard from '@/components/SurveyForm/SurveyFormContactCard.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import dayjs from 'dayjs';
import SurveyFormContactForm from '@/components/SurveyForm/SurveyFormContactForm.vue';
import { useAuth } from '@/composables/useAuth.js';
import { isString } from '@/utils/helpers/string/isString.js';
import { toBool } from '@/utils/helpers/string/toBool.js';

defineEmits([
    'edit',
    'delete',
    'move',
    'show-comments',
    'select',
    'change',
    'schedule-call',
    'close'
]);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    loading: Boolean,
    active: Boolean,
    disabled: Boolean,
    editable: Boolean,
    full: Boolean,
    mostCallable: Boolean
});

const form = defineModel({ type: Object });

const available = computed(() => {
    if (isNotNullish(form.value?.available)) {
        if (isString(form.value.available)) {
            return toBool(form.value.available);
        }

        return form.value.available;
    }

    return null;
});

const { currentUser } = useAuth();

const isCompleted = computed(() => {
    return isNotNullish(form.value?.available) && isNotNullish(form.value?.reason);
});

const callScheduled = computed(() => isNotNullish(form.value.scheduled));
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
    2: 'Больше не актуален',
    3: 'Будет перенесен',
    4: 'Не поднимает',
    5: 'Телефон недоступен',
    6: 'Абонент занят',
    7: 'Не существует/не зарегистрирован',
    8: 'Заблокирован'
};

const reasonOptionsIcons = {
    1: 'fa-solid fa-thumbs-up',
    2: 'fa-solid fa-thumbs-down',
    3: 'fa-solid fa-rotate',
    4: 'fa-solid fa-phone',
    5: 'fa-solid fa-phone-slash',
    6: 'fa-solid fa-user-clock',
    7: 'fa-solid fa-ban',
    8: 'fa-solid fa-user-slash'
};

const reasonClass = computed(() => {
    if (Number(form.value.reason) === 1) return 'dashboard-bg-success-l';
    return 'dashboard-bg-danger-l';
});

const descriptionShouldBeVisible = computed(
    () => available.value && isNotNullish(form.value.description) && form.value.description?.length
);
</script>
