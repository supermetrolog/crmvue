<template>
    <DashboardCard
        class="company-contact-item"
        :class="{
            active: contact.status && !contact.isMain,
            'is-main': contact.isMain
        }"
    >
        <div class="company-contact-item__header">
            <UiTooltipIcon
                v-if="contact.warning"
                tooltip="Внимание"
                icon="fa-solid fa-exclamation-circle"
                class="icon text-danger"
            />
            <UiTooltipIcon
                v-if="contact.good"
                tooltip="Хорошие взаимоотношения"
                icon="fa-solid fa-smile"
                class="icon text-success"
            />
            <UiTooltipIcon
                v-if="contact.faceToFaceMeeting"
                tooltip="Очная встреча"
                icon="fa-solid fa-street-view"
                class="icon"
            />
            <template v-if="!contact.type && !readOnly">
                <UiButtonIcon
                    @click="editContact"
                    small
                    color="light"
                    label="Редактировать"
                    icon="fa-solid fa-pen"
                    class="ml-auto"
                />
                <UiButtonIcon
                    v-if="isPassive"
                    @click="$emit('enable')"
                    small
                    color="light"
                    label="Восстановить"
                    icon="fa-solid fa-undo"
                />
                <UiButtonIcon
                    v-else
                    @click="$emit('disable')"
                    small
                    color="light"
                    label="В архив"
                    icon="fa-solid fa-ban"
                />
                <UiButtonIcon
                    @click="deleteContact"
                    small
                    color="light"
                    label="Удалить"
                    icon="fa-solid fa-trash"
                />
            </template>
        </div>
        <div v-if="!contact.status" class="company-contact-item__section">
            <UiField class="company-contact-item__chip dashboard-bg-danger dashboard-cl-white">
                Пассив
            </UiField>
            <span>
                <b>{{ passiveWhy }}</b>
            </span>
            <p class="mt-1">{{ contact.passive_why_comment }}</p>
        </div>
        <div v-if="contact.warning" class="company-contact-item__section">
            <UiField class="company-contact-item__chip dashboard-bg-danger dashboard-cl-white">
                Внимание!
            </UiField>
            <span>{{ contact.warning_why_comment }}</span>
        </div>
        <div class="company-contact-item__userinfo my-1 text-center">
            <strong>{{ name }}</strong>
            <small class="d-block text-grey">
                {{ contact.position ? position : 'Должность неизвестна' }}
            </small>
        </div>
        <div class="company-contact-item__body">
            <div class="company-contact-item__field justify-content-center">
                <div v-if="contact.wayOfInformings.length" class="d-flex gap-1">
                    <UiButtonIcon
                        v-for="(way, key) of wayOfCommunicate"
                        :key="key"
                        :label="way.label"
                        small
                        :icon="way.icon"
                    />
                </div>
                <span v-else class="company-contact-item__error">Способы связи не указаны</span>
            </div>
        </div>
        <div
            v-if="contact.phones.length || contact.emails.length"
            class="company-contact-item__phones mt-1"
        >
            <PhoneNumber
                :phone="mainPhone"
                :contact="contact"
                class="company-contact-item__phone"
            />
            <a
                v-for="email in contact.emails"
                :key="email.id"
                :href="'mailto:' + email.email"
                class="company-contact-item__phone"
            >
                {{ email.email }}
            </a>
        </div>
        <p v-else class="company-contact-item__error">Контакты для связи не указаны</p>
        <div class="company-contact-item__messages mt-2">
            <UiAccordion :title="`Комментарии (${contact.comments?.length ?? 0})`" without-render>
                <template #body>
                    <CompanyContactItemComments
                        @create="createComment"
                        @deleted="$emit('comment-deleted', $event)"
                        @updated="$emit('comment-updated', $event)"
                        class="mt-3"
                        :comments="contact.comments"
                    />
                </template>
            </UiAccordion>
        </div>
        <p v-if="contact.consultant" class="company-contact-item__consultant mt-2">
            Ведущий консультант: {{ contact.consultant.userProfile.short_name }}
        </p>
    </DashboardCard>
</template>

<script setup>
import { PassiveWhyContact } from '@/const/const.js';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import CompanyContactItemComments from '@/components/Company/Contact/CompanyContactItemComments.vue';
import { computed } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiAccordion from '@/components/common/UI/Accordion/UiAccordion.vue';

const emit = defineEmits([
    'start-editing',
    'delete-contact',
    'create-comment',
    'comment-deleted',
    'disable',
    'enable'
]);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    readOnly: {
        type: Boolean,
        default: false
    }
});

const name = computed(() => (props.contact.type ? 'Общий контакт' : props.contact.full_name));
const position = computed(() => contactOptions.position[props.contact.position]);
const wayOfCommunicate = computed(() =>
    props.contact.wayOfInformings.map(element => contactOptions.wayOfCommunicate[element.way])
);
const passiveWhy = computed(() => PassiveWhyContact[props.contact.passive_why]?.label);

const createComment = comment => {
    emit('create-comment', { contact_id: props.contact.id, comment: comment });
};
const editContact = () => {
    emit('start-editing', props.contact);
};
const deleteContact = () => {
    emit('delete-contact', { ...props.contact, header: name.value });
};

const mainPhone = computed(() => {
    if (props.contact.phones?.length) {
        return props.contact.phones.find(phone => phone.isMain) ?? props.contact.phones[0];
    }

    return null;
});

const isPassive = computed(() => props.contact.status === contactOptions.statusStatement.PASSIVE);
</script>
