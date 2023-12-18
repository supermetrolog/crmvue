<template>
    <div
        @click="clickContact"
        class="CompanyBoxContactListItem"
        :class="{
            'CompanyBoxContactListItem-is_main': contact.isMain,
            'CompanyBoxContactListItem-good': !!contact.good
        }"
    >
        <span v-if="!contact.status" class="CompanyBoxContactListItem-passive">Пассив</span>
        <div v-if="!contact.type" @click.stop="editContact(contact)" class="CompanyBoxContactListItem-edit">[ред.]</div>
        <div v-if="!!contact.warning && contact.status" class="CompanyBoxContactListItem-status text-danger">
            <span>ВНИМАНИЕ!!!</span>
        </div>
        <i
            v-if="contact.faceToFaceMeeting"
            title="Очная встреча"
            class="CompanyBoxContactListItem-status mr-2 text-dark fa-solid fa-street-view"
        ></i>
        <strong v-if="!contact.type" class="CompanyBoxContactListItem-name" :title="contact.full_name || ''">{{
            contact.full_name || 'Имя неизвестно'
        }}</strong>
        <strong v-if="contact.type" class="CompanyBoxContactListItem-name">Общий контакт</strong>
        <span class="CompanyBoxContactListItem-position">{{
            contact.position_unknown ? 'Должность неизвестна' : position
        }}</span>
        <PhoneNumber
            v-if="contact.phones.length"
            class="CompanyBoxContactListItem-phone"
            :phone="mainPhone || contact.phones[0]"
            :contact="contact"
        />
        <div v-if="contact.emails.length" class="CompanyBoxContactListItem-email">
            <a :href="'mailto:' + mainMail" class="d-block">
                {{ mainMail }}
            </a>
        </div>
        <hr />
        <div v-if="contact.consultant" class="CompanyBoxContactListItem-consultant">
            <span>
                конс: {{ contact.consultant.userProfile.short_name }}
                <template v-if="updateDate">{{ updateDate }}</template>
            </span>
        </div>
    </div>
</template>

<script>
import { PositionList } from '@/const/const.js';
import moment from 'moment';

export default {
    name: 'CompanyBoxContactListItem',
    inject: ['openContact', 'editContact'],
    props: {
        contact: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            positionList: PositionList.get('param')
        };
    },
    computed: {
        position() {
            return this.positionList[this.contact.position]?.label;
        },
        updateDate() {
            let date = this.contact.updated_at ? this.contact.updated_at : this.contact.created_at;
            if (!date) {
                return false;
            }
            return moment(date).format('DD.MM.YYYY');
        },
        mainPhone() {
            return this.contact.phones.find(phone => phone.isMain);
        },
        mainMail() {
            let mainMail = this.contact.emails.find(email => email.isMain);
            if (mainMail) {
                return mainMail.email;
            } else {
                return this.contact.emails[0].email;
            }
        }
    },
    methods: {
        clickContact() {
            this.openContact(this.contact);
        }
    }
};
</script>