<template>
    <DashboardCard
        class="company-contact-item"
        :class="{
            active: contact.status && !contact.isMain,
            'is-main': contact.isMain
        }"
    >
        <div class="company-contact-item__header">
            <i
                v-if="contact.warning"
                v-tippy="'Внимание'"
                class="fas fa-exclamation-circle icon text-danger"
            ></i>
            <i
                v-if="contact.good"
                v-tippy="'Хорошие взаимоотношения'"
                class="fa-solid fa-smile text-success icon"
            ></i>
            <i
                v-if="contact.faceToFaceMeeting"
                v-tippy="'Очная встреча'"
                class="fas fa-street-view icon"
            ></i>
            <HoverActionsButton
                v-if="!contact.type && !readOnly"
                @click="editContact"
                small
                class="ml-auto"
                label="Редактировать"
            >
                <i class="fa-solid fa-pen"></i>
            </HoverActionsButton>
            <HoverActionsButton
                v-if="!contact.type && !readOnly"
                @click="deleteContact"
                small
                label="Удалить"
            >
                <i class="fa-solid fa-trash"></i>
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
                        <i :class="way.icon"></i>
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
                :comments="contact.contactComments"
            />
        </div>
        <p v-if="contact.consultant" class="company-contact-item__consultant mt-2">
            Ведущий консультант: {{ contact.consultant.userProfile.short_name }}
        </p>
    </DashboardCard>
</template>

<script>
import { FeedbackIcons, PassiveWhyContact } from '@/const/const.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import { entityOptions } from '@/const/options/options.js';
import Button from '@/components/common/Button.vue';
import CompanyContactItemComments from '@/components/Company/Contact/CompanyContactItemComments.vue';

export default {
    name: 'CompanyContactItem',
    components: {
        CompanyContactItemComments,
        Button,
        DashboardCard,
        DashboardChip,
        HoverActionsButton
    },
    emits: ['start-editing', 'delete-contact', 'create-comment'],
    props: {
        contact: {
            type: Object,
            required: true
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            extraInfoIsVisible: false,
            comment: ''
        };
    },
    computed: {
        wayOfInformings: () => FeedbackIcons,
        passiveWhyOptions: () => PassiveWhyContact,
        name() {
            if (this.contact.type) {
                return 'Общий контакт';
            }
            return this.contact.first_and_last_name;
        },
        position() {
            return entityOptions.contact.position[this.contact.position];
        },
        wayOfCommunicate() {
            return this.contact.wayOfInformings.map(
                element => entityOptions.contact.wayOfCommunicate[element.way]
            );
        },
        passiveWhy() {
            return PassiveWhyContact[this.contact.passive_why].label;
        }
    },
    methods: {
        getWayClass(way) {
            return this.wayOfInformings[way].icon;
        },
        getWayTitle(way) {
            return this.wayOfInformings[way].name;
        },
        createComment(comment) {
            this.$emit('create-comment', {
                contact_id: this.contact.id,
                comment
            });
        },
        editContact() {
            this.$emit('start-editing', this.contact);
        },
        deleteContact() {
            this.$emit('delete-contact', { ...this.contact, header: this.name });
        }
    }
};
</script>

<style></style>
