<template>
    <SurveyFormContactFormElement
        :icon
        class="survey-form-contact-form-phone"
        :active
        :class="{
            success: hasSuccessCall,
            danger: hasFailCall
        }"
    >
        <template #header>
            <p class="survey-form-contact-form-phone__value">
                <span>{{ phone.phone }}</span>
                <span v-if="phone.exten">доб. {{ phone.exten }}</span>
            </p>
        </template>
        <template #footer>
            <p class="survey-form-contact-form-phone__footer">
                <span>{{ callsCountLabel }}</span>
                <span
                    v-if="currentCalls.length > 0"
                    class="survey-form-contact-form-phone__last-call"
                    :class="lastCallHasCompletedStatus ? 'success' : 'danger'"
                >
                    Последний звонок: {{ lastCallDateLabel }}. {{ lastCallStatusLabel }}
                </span>
            </p>
        </template>
    </SurveyFormContactFormElement>
</template>
<script setup lang="ts">
import SurveyFormContactFormElement from '@/components/SurveyForm/SurveyFormContactFormElement.vue';
import { Phone } from '@/types/contact/phone';
import { Contact } from '@/types/contact/contact';
import { computed } from 'vue';
import { pluralTemplate } from '@/utils/plural';
import { toBeautifulDateFormat } from '@/utils/formatters/date';
import { callStatus } from '@/const/options/call.options';
import { callStatusEnum } from '@/const/enums/call';
import { toBool } from '@/utils/helpers/string/toBool';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const props = defineProps<{
    phone: Phone;
    contact: Contact;
    active?: boolean;
    form?: {
        available: boolean;
        reason: number | string;
    };
}>();

const currentCalls = computed(() => {
    if (props.contact.calls?.length) {
        return props.contact.calls!.filter(call => call.phone_id === props.phone.id);
    }

    return [];
});

const callsCountLabel = computed(() => {
    if (currentCalls.value.length > 0) {
        return pluralTemplate(
            'Всего %s.',
            currentCalls.value.length,
            '%d звонок',
            '%d звонка',
            '%d звонков'
        );
    }

    return 'Нет звонков.';
});

const lastCall = computed(() => {
    return currentCalls.value.reduce(
        (prev, call) => (prev.id > call.id ? prev : call),
        currentCalls.value[0]
    );
});

const lastCallHasCompletedStatus = computed(
    () => lastCall.value.status === callStatusEnum.COMPLETED
);

const lastCallDateLabel = computed(() => toBeautifulDateFormat(lastCall.value.created_at));
const lastCallStatusLabel = computed(() => callStatus[lastCall.value.status]);

const hasSuccessCall = computed(
    () => props.form?.available === true || toBool(props.form?.available)
);

const hasFailCall = computed(() => isNotNullish(props.form?.available) && !hasSuccessCall.value);

const icon = computed(() => {
    if (hasSuccessCall.value) {
        return 'fa-solid fa-phone-volume';
    }

    if (hasFailCall.value) {
        return 'fa-solid fa-phone-slash';
    }

    return 'fa-solid fa-phone';
});
</script>
