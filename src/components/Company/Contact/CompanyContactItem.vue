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
            <HoverActionsButton
                v-if="!contact.type && !readOnly"
                @click="editContact"
                small
                class="ml-auto"
                label="Редактировать"
            >
                <i class="fa-solid fa-pen" />
            </HoverActionsButton>
            <HoverActionsButton
                v-if="!contact.type && !readOnly"
                @click="deleteContact"
                small
                label="Удалить"
            >
                <i class="fa-solid fa-trash" />
            </HoverActionsButton>
        </div>
        <div v-if="!contact.status" class="company-contact-item__section">
            <DashboardChip
                class="company-contact-item__chip dashboard-bg-danger dashboard-cl-white"
            >
                Пассив
            </DashboardChip>
            <span>
                <b>{{ passiveWhy }}</b>
            </span>
            <p class="mt-1">{{ contact.passive_why_comment }}</p>
        </div>
        <div v-if="contact.warning" class="company-contact-item__section">
            <DashboardChip
                class="company-contact-item__chip dashboard-bg-danger dashboard-cl-white"
            >
                Внимание!
            </DashboardChip>
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
                    <HoverActionsButton
                        v-for="(way, key) of wayOfCommunicate"
                        :key="key"
                        :label="way.label"
                        small
                    >
                        <i :class="way.icon" />
                    </HoverActionsButton>
                </div>
                <span v-else class="company-contact-item__error">Способы связи не указаны</span>
            </div>
        </div>
        <div
            v-if="contact.phones.length || contact.emails.length"
            class="company-contact-item__phones mt-1"
        >
            <PhoneNumber
                v-for="phone of contact.phones"
                :key="phone.id"
                :phone="phone"
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
            <Button @click="extraInfoIsVisible = !extraInfoIsVisible" info small icon class="w-100">
                <span>Комментарии</span>
                <i
                    class="fa-regular"
                    :class="
                        extraInfoIsVisible ? 'fa-arrow-alt-circle-up' : 'fa-arrow-alt-circle-down'
                    "
                />
            </Button>
            <CompanyContactItemComments
                v-if="extraInfoIsVisible"
                @create="createComment"
                class="mt-3"
                :comments="contact.comments"
            />
        </div>
        <p v-if="contact.consultant" class="company-contact-item__consultant mt-2">
            Ведущий консультант: {{ contact.consultant.userProfile.short_name }}
        </p>
    </DashboardCard>
</template>

<script setup>
import { PassiveWhyContact } from '@/const/const.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Button from '@/components/common/Button.vue';
import CompanyContactItemComments from '@/components/Company/Contact/CompanyContactItemComments.vue';
import { computed, ref } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

const emit = defineEmits(['start-editing', 'delete-contact', 'create-comment']);
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

const extraInfoIsVisible = ref(false);

const name = computed(() => (props.contact.type ? 'Общий контакт' : props.contact.full_name));
const position = computed(() => contactOptions.position[props.contact.position]);
const wayOfCommunicate = computed(() =>
    props.contact.wayOfInformings.map(element => contactOptions.wayOfCommunicate[element.way])
);
const passiveWhy = computed(() => PassiveWhyContact[props.contact.passive_why].label);

const createComment = comment => {
    emit('create-comment', { contact_id: props.contact.id, comment: comment });
};
const editContact = () => {
    emit('start-editing', props.contact);
};
const deleteContact = () => {
    emit('delete-contact', { ...props.contact, header: name.value });
};
</script>
