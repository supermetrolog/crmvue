<template>
    <div class="fuck">
        <Modal @close="clickCloseModal" :title="contact.isMain ? 'Основной контакт' : 'Контакт'" class="normal">
            <div class="CompanyContactModal">
                <div class="CompanyContactModal-left">
                    <p class="CompanyContactModal-left-name">
                        {{ contact.type ? 'Общий контакт' : contact.full_name || 'Имя неизвестно' }}
                        <span
                            ><i
                                v-if="contact.good"
                                class="fas fa-smile mr-2 text-success"
                                title="Хорошие взаимоотношения"
                            ></i>
                            <i
                                v-if="contact.faceToFaceMeeting"
                                class="fas fa-street-view mr-2 text-dark"
                                title="Очная встреча"
                            ></i>
                            <i
                                v-if="!contact.type && !reedOnly"
                                @click="$emit('clickEditContact', contact)"
                                class="fas fa-pen text-primary edit"
                            ></i>
                        </span>
                    </p>
                    <div>
                        <span v-if="!contact.position_unknown">{{ position }}</span>
                        <span v-if="contact.position_unknown">Должость неизвестна</span>
                    </div>
                    <div v-if="contact.phones">
                        <PhoneNumber
                            v-for="phone of contact.phones"
                            :key="phone"
                            class="CompanyContactModal-left-phone CompanyBoxContactListItem-phone"
                            :class="{ 'CompanyContactModal-left-phone-main': phone.isMain }"
                            :phone="phone"
                            :contact="contact"
                        />
                    </div>
                    <div>
                        <a
                            v-for="email in contact.emails"
                            :key="email.id"
                            :href="'mailto:' + email.email"
                            class="d-block"
                            :class="{ 'CompanyContactModal-left-email-main': email.isMain }"
                        >
                            {{ email.email }}
                        </a>
                    </div>
                    <div>
                        <div class="way-list">
                            <i
                                v-for="way of contact.wayOfInformings"
                                :key="way.id"
                                class="px-1 text-info"
                                :title="getWayTitle(way.way)"
                                :class="getWayClass(way.way)"
                            ></i>
                        </div>
                    </div>
                    <div v-if="!contact.status" class="CompanyContactModal-left-passive">
                        <span>Пассив</span>
                        <span
v-if="contact.passive_why !== null"
                            >({{ passiveWhyOptions.find(elem => elem.value == contact.passive_why).label }})</span
                        >
                        <span v-if="contact.passive_why_comment"> по причине {{ contact.passive_why_comment }}</span>
                    </div>
                    <div></div>
                    <div class="CompanyContactModal-websites">
                        <template
v-if="contact.websites"
                            ><a
                                v-for="website in contact.websites"
                                :key="website"
                                :href="`http://${website.website}`"
                                target="_blank"
                                rel="noopener noreferrer"
                                :title="website"
                                >{{ website.website }}</a
                            ></template
                        >
                    </div>
                </div>
                <div class="CompanyContactModal-right">
                    <div v-if="contact.warning" class="CompanyContactModal-warning text-danger">
                        <span>ВНИМАНИЕ!!!</span>
                        <span v-if="contact.warning_why_comment"> - {{ contact.warning_why_comment }}</span>
                    </div>
                    <p>Комментарии</p>
                    <hr />
                    <div
                        v-if="contact.contactComments.length"
                        ref="comments"
                        class="CompanyContactModal-right-comments"
                    >
                        <div v-for="comment in contact.contactComments" :key="comment.id" class="contact-comment">
                            <strong>{{ comment.author.userProfile.short_name }}</strong>
                            <p>{{ comment.comment }}</p>
                            <small class="text-grey">{{ dateHandler(comment.created_at) }}</small>
                        </div>
                    </div>
                    <div class="CompanyContactModal-right-send_comment">
                        <textarea v-model="comment"></textarea>
                        <button @click="clickCreateComment">Отправить</button>
                    </div>
                </div>

                <div class="CompanyContactModal-footer">
                    <hr />
                    <span
v-if="contact.consultant?.userProfile.short_name"
                        >конс: {{ contact.consultant.userProfile.short_name }}</span
                    >
                    <span v-else></span>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import useValidate from '@vuelidate/core';
import { ActivePassive, FeedbackIcons, PassiveWhyContact, PositionList } from '@/const/const.js';
import api from '@/api/api';
import moment from 'moment';
import Modal from '@/components/common/Modal.vue';

export default {
    name: 'CompanyContactModal',
    components: {
        Modal
    },
    emits: ['closeContactModal', 'clickEditContact'],
    inject: ['createContactComment'],
    props: {
        contact: {
            type: Object,
            default: null
        },
        reedOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            v$: useValidate(),
            loader: false,
            selectedCompany: null,
            comment: ''
        };
    },
    computed: {
        ...mapGetters(['CONSULTANT_LIST']),
        wayOfInformings: () => FeedbackIcons,
        positionList: () => PositionList,
        statusOptions: () => ActivePassive,
        passiveWhyOptions: () => PassiveWhyContact,
        position() {
            return this.positionList[this.contact.position]?.label;
        }
    },
    watch: {
        'contact.contactComments': {
            handler() {
                setTimeout(this.scrollToElement, 0);
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(['FETCH_CONSULTANT_LIST', 'SEARCH_COMPANIES']),
        getWayClass(way) {
            return this.wayOfInformings[way].icon;
        },
        getWayTitle(way) {
            return this.wayOfInformings[way].name;
        },
        async updateContact() {
            if (await this.UPDATE_CONTACT(this.form)) {
                this.$emit('updated');
                this.clickCloseModal();
            }
            this.loader = false;
        },
        clickCreateComment() {
            let data = {
                contact_id: this.contact.id,
                comment: this.comment
            };
            this.comment = null;
            this.createContactComment(data);
        },
        async searchCompany(query) {
            let result = null;
            let array = [];
            if (this.formdata || this.company_id) {
                if (!this.selectedCompany) {
                    this.selectedCompany = await api.companies.getCompany(
                        this.formdata ? this.formdata.company_id : this.company_id
                    );
                }

                array.push({
                    value: this.selectedCompany.id,
                    label: this.selectedCompany.full_name
                });
            }
            query = {
                all: query
            };
            result = await api.companies.searchCompanies(query);
            result.data.forEach(item => {
                array.push({ value: item.id, label: item.full_name });
            });
            return array;
        },

        clickCloseModal() {
            this.$emit('closeContactModal');
        },
        scrollToElement() {
            const el = this.$refs.comments;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        },

        dateHandler(date) {
            return moment(date).format('DD.MM.YYYY');
        }
    },
    mounted() {
        this.scrollToElement();
    }
};
</script>

<style></style>
