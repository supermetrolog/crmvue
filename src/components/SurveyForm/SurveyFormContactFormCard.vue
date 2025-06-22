<template>
    <div class="survey-form-contact-form-card">
        <div class="mb-3">
            <p class="survey-form-contact-form-card__calls">
                <i class="fa-solid fa-phone survey-form-contact-form-card__icon mr-1" />
                <span class="font-weight-semi">{{ callsPluralLabel }}</span>
                <span
                    v-if="contact.calls?.length"
                    :class="lastCallHasCompletedStatus ? 'text-success' : 'text-danger'"
                >
                    Последней звонок {{ lastCallDate }}. {{ lastCallStatus }}.
                </span>
                <span></span>
            </p>
            <p v-if="lastThreeCallsIsUnavailable" class="text-danger mt-1">
                <i>Не удалось дозвониться уже более 3х раз подряд!</i>
            </p>
        </div>
        <div class="mt-1 survey-form-contact-form-card__contacts">
            <p>Телефоны:</p>
            <div class="d-flex flex-column gap-1 align-items-start mb-3">
                <PhoneNumber
                    v-for="phone of contact.phones"
                    :key="phone.id"
                    :phone="phone"
                    clickable
                    class="survey-form-contact-form-card__phone"
                />
                <p v-if="!contact.phones.length" class="text-danger">не заполнено</p>
            </div>
            <p>Эл. почта:</p>
            <div class="d-flex flex-column gap-1 align-items-start">
                <p
                    v-for="email in contact.emails"
                    :key="email.id"
                    class="survey-form-contact-form-card__phone text-info"
                >
                    {{ email.email }}
                </p>
                <p v-if="!contact.emails.length" class="text-danger">не заполнено</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import PhoneNumber from '@/components/common/PhoneNumber.vue';
import { plural } from '@/utils/plural.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import { callStatusEnum } from '@/const/enums/call.js';
import { callStatus } from '@/const/options/call.options.js';

defineEmits(['schedule-call']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const callsPluralLabel = computed(() => {
    const count = props.contact.calls?.length ?? 0;

    if (count > 0) {
        return `Всего ${plural(count, '%d звонок', '%d звонка', '%d звонков')}.`;
    }

    return 'Нет звонков..';
});

const lastCallDate = computed(() => {
    const lastCall = props.contact.calls[0];

    return toBeautifulDateFormat(lastCall.created_at);
});

const lastThreeCallsIsUnavailable = computed(() => {
    if (props.contact.calls.length >= 3) {
        return props.contact.calls.slice(0, 3).every(element => element.status === 0);
    }

    return false;
});

const lastCallHasCompletedStatus = computed(
    () => props.contact.calls[0].status === callStatusEnum.COMPLETED
);

const lastCallStatus = computed(() => callStatus[props.contact.calls[0].status]);
</script>
