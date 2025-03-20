<template>
    <div
        class="company-box-contact"
        :class="{
            'company-box-contact--main': contact.isMain,
            'company-box-contact--good': !!contact.good
        }"
    >
        <div class="company-box-contact__header mb-1">
            <DashboardChip v-if="!contact.status" class="dashboard-bg-warning">
                Пассив
            </DashboardChip>
            <DashboardChip
                v-if="!!contact.warning && contact.status"
                class="dashboard-bg-danger text-white"
            >
                Внимание!
            </DashboardChip>
            <DashboardChip
                v-if="contact.faceToFaceMeeting"
                ref="faceToFaceEl"
                class="dashboard-bg-success"
            >
                <i class="fa-solid fa-street-view"></i>
            </DashboardChip>
        </div>
        <strong v-if="contact.type" class="company-box-contact__name">Общий контакт</strong>
        <strong v-else class="company-box-contact__name">
            {{ contact.full_name || 'Имя неизвестно' }}
        </strong>
        <span class="company-box-contact__position">
            {{ contact.position_unknown ? 'Должность неизвестна' : position }}
        </span>
        <PhoneNumber
            v-if="contact.phones.length"
            class="company-box-contact__phone"
            :phone="mainPhone || contact.phones[0]"
            :contact="contact"
        />
        <CopyField
            v-if="contact.emails.length"
            :value="mainMail"
            class="company-box-contact__email"
            message="Электронная почта скопирована"
        >
            <span>{{ mainMail }}</span>
        </CopyField>
        <hr />
        <div v-if="contact.consultant" class="company-box-contact__consultant">
            <span>
                конс: {{ contact.consultant.userProfile.short_name }}
                <template v-if="updatedAt">{{ updatedAt }}</template>
            </span>
        </div>
    </div>
</template>

<script setup>
import { PositionList } from '@/const/const.js';
import dayjs from 'dayjs';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import CopyField from '@/components/common/CopyField.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import { computed, useTemplateRef } from 'vue';

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const position = computed(() => {
    return props.contact.position ? PositionList[props.contact.position].label : '-';
});

const updatedAt = computed(() => {
    let date = props.contact.updated_at ?? props.contact.created_at;
    if (!date) return null;

    return dayjs(date).format('DD.MM.YYYY');
});

const mainPhone = computed(() => {
    return props.contact.phones.find(phone => phone.isMain);
});

const mainMail = computed(() => {
    let mainMail = props.contact.emails.find(email => email.isMain);
    if (mainMail) return mainMail.email;
    else return props.contact.emails[0].email;
});

useTippyText(useTemplateRef('faceToFaceEl'), 'Очная встреча');
</script>
