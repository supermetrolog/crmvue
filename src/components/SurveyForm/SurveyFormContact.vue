<template>
    <div class="survey-form-contact">
        <div class="survey-form-contact__row mb-2">
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
                data-tour-id="survey-form:stepper-calls"
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
                    <!--                    <i class="fa-solid fa-arrow-right-long survey-form-contact__result-arrow"></i>-->
                    <!--                    <div class="d-flex flex-column gap-1 flex-shrink-0">-->
                    <!--                        <div class="survey-form-contact__block" :class="reasonClass">-->
                    <!--                            <p>-->
                    <!--                                <i-->
                    <!--                                    :class="-->
                    <!--                                        hasAvailabled-->
                    <!--                                            ? 'fa-solid fa-thumbs-up'-->
                    <!--                                            : 'fa-solid fa-thumbs-down'-->
                    <!--                                    "-->
                    <!--                                    class="mr-2"-->
                    <!--                                />-->
                    <!--                                <span>{{ hasAvailabled ? 'Актуален' : '' }}</span>-->
                    <!--                            </p>-->
                    <!--                        </div>-->
                    <!--                        <div-->
                    <!--                            v-if="form.scheduled"-->
                    <!--                            class="survey-form-contact__block dashboard-bg-success-l"-->
                    <!--                        >-->
                    <!--                            <p>-->
                    <!--                                <i class="mr-2 fa-solid fa-phone" />-->
                    <!--                                <span>Звонок</span>-->
                    <!--                                <span v-if="form.scheduled" class="ml-1">-->
                    <!--                                    {{ callScheduledDate }}-->
                    <!--                                </span>-->
                    <!--                            </p>-->
                    <!--                        </div>-->
                    <!--                    </div>-->
                    <!--                    <template v-if="descriptionShouldBeVisible">-->
                    <!--                        <i-->
                    <!--                            class="fa-solid fa-arrow-right-long survey-form-contact__result-arrow"-->
                    <!--                        ></i>-->
                    <!--                        <div class="survey-form-contact__description fs-2">-->
                    <!--                            <p class="fs-1 text-grey">-->
                    <!--                                <i>Задача {{ currentUser.userProfile.middle_name }} => Еськова</i>-->
                    <!--                            </p>-->
                    <!--                            <i>{{ form.description }}</i>-->
                    <!--                        </div>-->
                    <!--                    </template>-->
                </div>
            </AnimationTransition>
        </div>
        <TransitionExpand>
            <SurveyFormContactForm
                v-if="active"
                v-model="form"
                @close="$emit('close')"
                @change="$emit('change')"
                @schedule-call="$emit('schedule-call')"
                @schedule-visit="$emit('schedule-visit')"
                @schedule-event="$emit('schedule-event')"
                :contact
                :company
            />
        </TransitionExpand>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import SurveyFormContactCard from '@/components/SurveyForm/SurveyFormContactCard.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import SurveyFormContactForm from '@/components/SurveyForm/SurveyFormContactForm.vue';
import { isString } from '@/utils/helpers/string/isString.js';
import { toBool } from '@/utils/helpers/string/toBool.js';
import { TransitionExpand } from '@morev/vue-transitions';

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
    company: Object,
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

// const { currentUser } = useAuth();
//
// const phones = computed(() => {
//     if (form.value.phones) {
//         return Object.values(form.value.phones);
//     }
//
//     return [];
// });

const isCompleted = computed(() => {
    if (form.value.phones) {
        return Object.values(form.value.phones).some(
            phone => isNotNullish(phone?.available) && isNotNullish(phone?.reason)
        );
    }

    return isNotNullish(form.value?.available) && isNotNullish(form.value?.reason);
});

// const callScheduledDate = computed(() => dayjs(form.value.scheduled).format('DD.MM.YY, HH:mm'));

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

// TODO: Вернуть прогресс сверху

// const reasonOptions = {
//     1: 'Актуален',
//     2: 'Больше не актуален',
//     3: 'Будет перенесен',
//     4: 'Не поднимает',
//     5: 'Телефон недоступен',
//     6: 'Абонент занят',
//     7: 'Не существует/не зарегистрирован',
//     8: 'Заблокирован'
// };
//
// const reasonOptionsIcons = {
//     1: 'fa-solid fa-thumbs-up',
//     2: 'fa-solid fa-thumbs-down',
//     3: 'fa-solid fa-rotate',
//     4: 'fa-solid fa-phone',
//     5: 'fa-solid fa-phone-slash',
//     6: 'fa-solid fa-user-clock',
//     7: 'fa-solid fa-ban',
//     8: 'fa-solid fa-user-slash'
// };
//
// const reasonClass = computed(() => {
//     if (Number(form.value.reason) === 1) return 'dashboard-bg-success-l';
//     return 'dashboard-bg-danger-l';
// });
//
// const descriptionShouldBeVisible = computed(
//     () => available.value && isNotNullish(form.value.description) && form.value.description?.length
// );
</script>
