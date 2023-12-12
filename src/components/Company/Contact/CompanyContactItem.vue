<template>
    <div
        class="row item mb-2"
        :class="{
      active: contact.status && !contact.isMain,
      isMain: contact.isMain,
    }"
    >
        <div class="col-12 text-center general-info py-2">
            <div class="header row mb-0">
                <div class="index col-12 p-0 text-center">
                    <!-- <i
                      class="fas fa-times text-danger delete"
                      @click="deleteContact"
                      v-if="!contact.type && !reedOnly"
                    ></i> -->
                    <i
                        class="fas fa-exclamation-circle mr-2 text-danger"
                        v-if="contact.warning"
                        title="Внимание"
                    ></i>
                    <i
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
                        @click="openContactFormForUpdate"
                        v-if="!contact.type && !reedOnly"
                    ></i>
                </div>
            </div>
            <div class="text-center mb-1" v-if="!contact.status">
                <h4 class="text-warning">Пассив!</h4>
                <p class="text-dark">
                    <b>{{ passiveWhyOptions[contact.passive_why].label }}</b>
                </p>
                <p class="text-dark d-block">{{ contact.passive_why_comment }}</p>
                <hr/>
            </div>
            <div class="text-center mb-1" v-if="contact.warning">
                <h4 class="text-danger">Внимание!</h4>
                <p class="text-dark d-block">{{ contact.warning_why_comment }}</p>
                <hr/>
            </div>
            <div class="name">
                <strong :title="contact.full_name"> {{ name }} </strong>
                <small class="d-block text-grey">{{
                        position ? position : "должность неизвестна"
                    }}</small>
            </div>

            <div class="body">
                <div class="way-list">
                    <i
                        class="px-1 text-info"
                        :title="getWayTitle(way.way)"
                        :class="getWayClass(way.way)"
                        v-for="way of contact.wayOfInformings"
                        :key="way.id"
                    ></i>
                </div>
                <div v-if="!contact.phones.length && !contact.emails.length">
                    нет данных
                </div>
                <div class="phone-list">
                    <PhoneNumber
                        v-for="phone of contact.phones"
                        :key="phone.id"
                        :phone="phone"
                        :contact="contact"
                    />
                </div>

                <div class="email-list">
                    <a
                        :href="'mailto:' + email.email"
                        class="d-block"
                        v-for="email in contact.emails"
                        :key="email.id"
                    >
                        {{ email.email }}
                    </a>
                </div>
                <i
                    class="far fa-arrow-alt-circle-down d-block open-extra-info mt-1"
                    @click="openExtraInfo"
                    v-if="!extraInfoVisible"
                    title="Комментарии"
                ></i>
                <i
                    class="far fa-arrow-alt-circle-up d-block open-extra-info mt-1"
                    @click="closeExtraInfo"
                    v-if="extraInfoVisible"
                ></i>
                <hr/>
                <div class="extra-info row" v-if="extraInfoVisible">
                    <div
                        class="col-12 comment-list text-left"
                        v-if="contact.contactComments.length"
                    >
                        <Loader class="center small" v-if="createCommentLoader"/>
                        <div
                            class="comment"
                            v-for="comment in contact.contactComments"
                            :key="comment.id"
                        >
                            <strong>{{ comment.author.userProfile.short_name }}</strong>
                            <p>{{ comment.comment }}</p>
                            <small class="text-grey">{{ comment.created_at }}</small>
                        </div>
                        <hr/>
                    </div>
                    <div class="col-12" v-else>
                        <Loader class="center small" v-if="createCommentLoader"/>
                        <p>комментарий нет</p>
                    </div>
                    <div class="col-12 mt-2">
                        <textarea v-model="comment"></textarea>
                        <button class="btn btn-primary btn-large" @click="createComment">
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
            <div class="footer row mt-1">
                <div class="col-12 consultant text-left" v-if="contact.consultant">
                    <p>ведет: {{ contact.consultant.userProfile.short_name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    FeedbackList,
    PositionList,
    PassiveWhyContact,
} from "@/const/const.js";
import Loader from "@/components/common/Loader.vue";


export default {
    name: "CompanyContactItem",
    components: {
        Loader
    },
    data() {
        return {
            wayOfInformings: FeedbackList.get("contact"),
            positionList: PositionList.get("param"),
            passiveWhyOptions: PassiveWhyContact.get("param"),
            extraInfoVisible: false,
            comment: "",
        };
    },
    props: {
        contact: {
            type: Object,
        },
        createCommentLoader: {
            type: Boolean,
        },
        reedOnly: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        name() {
            if (this.contact.type) {
                return "Общий контакт";
            }
            return this.contact.first_and_last_name;
        },
        position() {
            return this.positionList[this.contact.position]?.label;
        },
    },
    methods: {
        getWayClass(way) {
            return this.wayOfInformings[way][2];
        },
        getWayTitle(way) {
            return this.wayOfInformings[way][1];
        },
        openExtraInfo() {
            this.extraInfoVisible = true;
        },
        closeExtraInfo() {
            this.extraInfoVisible = false;
        },
        openContactFormForUpdate() {
            this.$emit("openContactFormForUpdate", this.contact);
        },
        createComment() {
            let data = {
                contact_id: this.contact.id,
                comment: this.comment,
            };
            this.comment = null;
            this.$emit("createComment", data);
        },
        deleteContact() {
            let data = {
                ...this.contact,
            };
            data.header = this.name;
            this.$emit("deleteContact", data);
        },
    },
    emits: ["openContactFormForUpdate", "deleteContact", "createComment"],
};
</script>

<style>
</style>