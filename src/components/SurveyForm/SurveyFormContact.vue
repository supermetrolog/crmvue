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
                    <IconArrowRight class="survey-form-contact__result-arrow" width="55px" />
                    <div class="survey-form-contact__block dashboard-bg-success-l">
                        <p>
                            <i class="fa-solid fa-check mr-2" />
                            <span>Обработан</span>
                        </p>
                    </div>
                    <IconArrowRight class="survey-form-contact__result-arrow" width="55px" />
                    <div class="d-flex flex-column gap-1 flex-shrink-0">
                        <div class="survey-form-contact__block" :class="reasonClass">
                            <p>
                                <i :class="reasonIcon" class="mr-2" />
                                <span>{{ reasonLabel }}</span>
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
                        <IconArrowRight class="survey-form-contact__result-arrow" width="60px" />
                        <div class="survey-form-contact__description fs-2">
                            <p class="fs-1 text-grey">
                                <i>Задача {{ targetUser.userProfile.middle_name }} => Еськова</i>
                            </p>
                            <i>{{ description }}</i>
                        </div>
                    </template>
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
                :survey
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
import { toBool } from '@/utils/helpers/common/toBool';
import { TransitionExpand } from '@morev/vue-transitions';
import IconArrowRight from '@/components/common/Icons/IconArrowRight.vue';
import dayjs from 'dayjs';
import { useAuth } from '@/composables/useAuth';

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
    survey: Object,
    loading: Boolean,
    active: Boolean,
    disabled: Boolean,
    editable: Boolean,
    full: Boolean,
    mostCallable: Boolean
});

const form = defineModel({ type: Object });

const { currentUser } = useAuth();

const targetUser = computed(() => {
    if (props.survey) {
        return props.survey.user;
    }

    return currentUser.value;
});

const phones = computed(() => Object.values(form.value?.phones ?? {}));

const availablePhones = computed(() =>
    phones.value.filter(phone => isNotNullish(phone.available) && toBool(phone.available))
);

const emails = computed(() => Object.values(form.value?.emails ?? {}));

const availableEmails = computed(() =>
    emails.value.filter(email => isNotNullish(email.available) && toBool(email.available))
);

const phoneReasons = computed(() =>
    phones.value.reduce((acc, phone) => {
        if (isNotNullish(phone.available) && isNotNullish(phone.reason)) {
            acc.push(Number(phone.reason));
        }

        return acc;
    }, [])
);

const emailReasons = computed(() =>
    emails.value.reduce((acc, email) => {
        if (isNotNullish(email.available) && isNotNullish(email.reason)) {
            acc.push(Number(email.reason));
        }

        return acc;
    }, [])
);

const available = computed(() => {
    if (isNotNullish(form.value?.available)) {
        return toBool(form.value.available);
    }

    if (phones.value.length || emails.value.length) {
        const completedPhones = phones.value.filter(phone => isNotNullish(phone.available));
        const completedEmails = emails.value.filter(email => isNotNullish(email.available));

        if (!completedPhones.length && !completedEmails.length) {
            return null;
        }

        return availablePhones.value.length > 0 || availableEmails.value.length > 0;
    }

    return null;
});

const reasonLabel = computed(() => {
    if (phones.value.length || emails.value.length) {
        if (availablePhones.value.length) {
            if (phoneReasons.value.includes(reasonOptionsEnum.ACTUAL)) {
                return reasonOptions[reasonOptionsEnum.ACTUAL];
            }

            if (phoneReasons.value.includes(reasonOptionsEnum.NOT_ACTUAL)) {
                return reasonOptions[reasonOptionsEnum.NOT_ACTUAL];
            }

            if (phoneReasons.value.includes(reasonOptionsEnum.SHOULD_BE_MOVED)) {
                return reasonOptions[reasonOptionsEnum.SHOULD_BE_MOVED];
            }
        }

        if (availableEmails.value.length) {
            if (emailReasons.value.includes(reasonOptionsEnum.ACTUAL)) {
                return reasonOptions[reasonOptionsEnum.ACTUAL];
            }

            if (emailReasons.value.includes(reasonOptionsEnum.NOT_ACTUAL)) {
                return reasonOptions[reasonOptionsEnum.NOT_ACTUAL];
            }

            if (emailReasons.value.includes(reasonOptionsEnum.SHOULD_BE_MOVED)) {
                return reasonOptions[reasonOptionsEnum.SHOULD_BE_MOVED];
            }

            return 'Получен ответ на письмо';
        }

        if (emails.value.length) {
            return 'Ответ не получен';
        }

        if (phoneReasons.value.length) {
            return reasonOptions[phoneReasons.value[0]];
        }

        if (emailReasons.value.length) {
            return reasonOptions[emailReasons.value[0]];
        }
    }

    return isNotNullish(form.value.reason) ? Number(form.value.reason) : null;
});

const reasonIcon = computed(() => {
    if (phones.value.length || emails.value.length) {
        if (availablePhones.value.length) {
            if (phoneReasons.value.includes(reasonOptionsEnum.ACTUAL)) {
                return reasonOptionsIcons[reasonOptionsEnum.ACTUAL];
            }

            if (phoneReasons.value.includes(reasonOptionsEnum.NOT_ACTUAL)) {
                return reasonOptionsIcons[reasonOptionsEnum.NOT_ACTUAL];
            }

            if (phoneReasons.value.includes(reasonOptionsEnum.SHOULD_BE_MOVED)) {
                return reasonOptionsIcons[reasonOptionsEnum.SHOULD_BE_MOVED];
            }
        }

        if (availableEmails.value.length) {
            if (emailReasons.value.includes(reasonOptionsEnum.ACTUAL)) {
                return reasonOptionsIcons[reasonOptionsEnum.ACTUAL];
            }

            if (emailReasons.value.includes(reasonOptionsEnum.NOT_ACTUAL)) {
                return reasonOptionsIcons[reasonOptionsEnum.NOT_ACTUAL];
            }

            if (emailReasons.value.includes(reasonOptionsEnum.SHOULD_BE_MOVED)) {
                return reasonOptionsIcons[reasonOptionsEnum.SHOULD_BE_MOVED];
            }

            return reasonOptionsIcons[reasonOptionsEnum.ACTUAL];
        }

        if (emails.value.length) {
            return reasonOptionsIcons[reasonOptionsEnum.NOT_ACTUAL];
        }

        if (phoneReasons.value.length) {
            return reasonOptionsIcons[phoneReasons.value[0]];
        }

        if (emailReasons.value.length) {
            return reasonOptionsIcons[emailReasons.value[0]];
        }
    }

    return isNotNullish(form.value.reason)
        ? reasonOptionsIcons[Number(form.value.reason)]
        : undefined;
});

const reasonClass = computed(() => {
    if (phones.value.length || emails.value.length) {
        if (phoneReasons.value.includes(reasonOptionsEnum.ACTUAL)) {
            return 'dashboard-bg-success-l';
        }

        if (
            emailReasons.value.includes(reasonOptionsEnum.ACTUAL) ||
            (emailReasons.value.length === 0 && availableEmails.value.length)
        ) {
            return 'dashboard-bg-success-l';
        }

        return 'dashboard-bg-danger-l';
    }

    if (Number(form.value.reason) === 1) return 'dashboard-bg-success-l';
    return 'dashboard-bg-danger-l';
});

const isCompleted = computed(() => {
    if (form.value.phones || form.value.emails) {
        const phonesHasCompletedForm = Object.values(form.value?.phones ?? {}).some(
            phone => isNotNullish(phone?.available) && isNotNullish(phone?.reason)
        );

        const emailsHasCompletedForm = Object.values(form.value?.emails ?? {}).some(email =>
            isNotNullish(email?.available)
        );

        return phonesHasCompletedForm || emailsHasCompletedForm;
    }

    return isNotNullish(form.value?.available) && isNotNullish(form.value?.reason);
});

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

// TODO: Вернуть прогресс сверху

const reasonOptionsEnum = {
    ACTUAL: 1,
    NOT_ACTUAL: 2,
    SHOULD_BE_MOVED: 3,
    MISSED: 4,
    NOT_AVAILABLE: 5,
    BUSY: 6,
    NOT_EXIST: 7,
    BLOCKED: 8
};

const reasonOptions = {
    [reasonOptionsEnum.ACTUAL]: 'Актуален',
    [reasonOptionsEnum.NOT_ACTUAL]: 'Больше не актуален',
    [reasonOptionsEnum.SHOULD_BE_MOVED]: 'Будет перенесен',
    [reasonOptionsEnum.MISSED]: 'Не поднимает',
    [reasonOptionsEnum.NOT_AVAILABLE]: 'Телефон недоступен',
    [reasonOptionsEnum.BUSY]: 'Абонент занят',
    [reasonOptionsEnum.NOT_EXIST]: 'Не существует/не зарегистрирован',
    [reasonOptionsEnum.BLOCKED]: 'Заблокирован'
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

const descriptionShouldBeVisible = computed(() => {
    if (!available.value) {
        return false;
    }

    if (form.value.phones) {
        return availablePhones.value.some(
            phone =>
                ((isNotNullish(phone.reason) &&
                    Number(phone.reason) === reasonOptionsEnum.SHOULD_BE_MOVED) ||
                    Number(phone.reason) === reasonOptionsEnum.NOT_ACTUAL) &&
                phone.description?.length
        );
    }

    return isNotNullish(form.value.description) && form.value.description?.length;
});

const description = computed(() => {
    if (form.value.phones) {
        return availablePhones.value.find(
            phone =>
                (isNotNullish(phone.reason) &&
                    Number(phone.reason) === reasonOptionsEnum.SHOULD_BE_MOVED) ||
                Number(phone.reason) === reasonOptionsEnum.NOT_ACTUAL
        )?.description;
    }

    return form.value.description;
});
</script>
