<template>
    <div class="fuck">
        <Modal
            :title="contact.isMain ? 'Основной контакт' : 'Контакт'"
            @close="clickCloseModal"
            class="normal"
        >
            <div class="CompanyContactModal">
                <div class="CompanyContactModal-left">
                    <p class="CompanyContactModal-left-name">
                        {{
                            contact.type
                                ? "Общий контакт"
                                : contact.full_name || "Имя неизвестно"
                        }}
                        <span
                        ><i
                            class="fas fa-smile mr-2 text-success"
                            v-if="contact.good"
                            title="Хорошие взаимоотношения"
                        ></i>
              <i
                  class="fas fa-street-view mr-2 text-dark"
                  v-if="contact.faceToFaceMeeting"
                  title="Очная встреча"
              ></i>
              <i
                  class="fas fa-pen text-primary edit"
                  @click="this.$emit('clickEditContact', this.contact)"
                  v-if="!contact.type && !reedOnly"
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
                            class="
                CompanyContactModal-left-phone
                CompanyBoxContactListItem-phone
              "
                            :class="{ 'CompanyContactModal-left-phone-main': phone.isMain }"
                            :phone="phone"
                            :contact="contact"
                        />
                    </div>
                    <div>
                        <a
                            :href="'mailto:' + email.email"
                            class="d-block"
                            :class="{ 'CompanyContactModal-left-email-main': email.isMain }"
                            v-for="email in contact.emails"
                            :key="email.id"
                        >
                            {{ email.email }}
                        </a>
                    </div>
                    <div>
                        <div class="way-list">
                            <i
                                class="px-1 text-info"
                                :title="getWayTitle(way.way)"
                                :class="getWayClass(way.way)"
                                v-for="way of contact.wayOfInformings"
                                :key="way.id"
                            ></i>
                        </div>
                    </div>
                    <div v-if="!contact.status" class="CompanyContactModal-left-passive">
                        <span>Пассив</span>
                        <span v-if="contact.passive_why !== null"
                        >({{
                                passiveWhyOptions.find(
                                    (elem) => elem.value == contact.passive_why
                                ).label
                            }})</span
                        >
                        <span v-if="contact.passive_why_comment">
              по причине {{ contact.passive_why_comment }}</span
                        >
                    </div>
                    <div></div>
                    <div class="CompanyContactModal-websites">
                        <template v-if="contact.websites"
                        ><a
                            :href="`http://${website.website}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            :title="website"
                            v-for="website in contact.websites"
                            :key="website"
                        >{{ website.website }}</a
                        ></template
                        >
                    </div>
                </div>
                <div class="CompanyContactModal-right">
                    <div
                        class="CompanyContactModal-warning text-danger"
                        v-if="contact.warning"
                    >
                        <span>ВНИМАНИЕ!!!</span>
                        <span v-if="contact.warning_why_comment">
              - {{ contact.warning_why_comment }}</span
                        >
                    </div>
                    <p>Комментарии</p>
                    <hr/>
                    <div
                        class="CompanyContactModal-right-comments"
                        v-if="contact.contactComments.length"
                        ref="comments"
                    >
                        <div
                            class="contact-comment"
                            v-for="comment in contact.contactComments"
                            :key="comment.id"
                        >
                            <strong>{{ comment.author.userProfile.short_name }}</strong>
                            <p>{{ comment.comment }}</p>
                            <small class="text-grey">{{
                                    dateHandler(comment.created_at)
                                }}</small>
                        </div>
                    </div>
                    <div class="CompanyContactModal-right-send_comment">
                        <textarea v-model="comment"></textarea>
                        <button @click="clickCreateComment">Отправить</button>
                    </div>
                </div>

                <div class="CompanyContactModal-footer">
                    <hr/>
                    <span v-if="contact.consultant?.userProfile.short_name"
                    >конс: {{ contact.consultant.userProfile.short_name }}</span
                    >
                    <span v-else></span>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import useValidate from "@vuelidate/core";
import {
    FeedbackList,
    PositionList,
    ActivePassive,
    PassiveWhyContact,
} from "@/const/const.js";
import api from "@/api/api";
import moment from "moment";
import Modal from "@/components/common/Modal.vue";

export default {
    name: "CompanyContactModal",
    components: {
        Modal,
    },
    data() {
        return {
            v$: useValidate(),
            wayOfInformings: FeedbackList.get("contact"),
            positionList: PositionList.get("param"),
            statusOptions: ActivePassive.get("param"),
            passiveWhyOptions: PassiveWhyContact.get("param"),
            loader: false,
            selectedCompany: null,
            comment: "",
        };
    },
    inject: ["createContactComment"],
    props: {
        contact: {
            type: Object,
            default: null,
        },
        reedOnly: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapGetters(["CONSULTANT_LIST"]),
        position() {
            return this.positionList[this.contact.position]?.label;
        },
    },
    methods: {
        ...mapActions(["FETCH_CONSULTANT_LIST", "SEARCH_COMPANIES"]),
        getWayClass(way) {
            return this.wayOfInformings[way][2];
        },
        getWayTitle(way) {
            return this.wayOfInformings[way][1];
        },
        async updateContact() {
            if (await this.UPDATE_CONTACT(this.form)) {
                this.$emit("updated");
                this.clickCloseModal();
            }
            this.loader = false;
        },
        clickCreateComment() {
            let data = {
                contact_id: this.contact.id,
                comment: this.comment,
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
                    label: this.selectedCompany.full_name,
                });
            }
            query = {
                all: query,
            };
            result = await api.companies.searchCompanies(query);
            result.data.forEach((item) => {
                array.push({value: item.id, label: item.full_name});
            });
            return array;
        },

        clickCloseModal() {
            this.$emit("closeContactModal");
        },
        scrollToElement() {
            const el = this.$refs.comments;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        },

        dateHandler(date) {
            return moment(date).format("DD.MM.YYYY");
        },
    },
    mounted() {
        this.scrollToElement();
    },
    watch: {
        "contact.contactComments": {
            handler() {
                setTimeout(this.scrollToElement, 0);
            },
            deep: true,
        },
    },
    emits: ["closeContactModal", "clickEditContact"],
};
</script>

<style>
</style>