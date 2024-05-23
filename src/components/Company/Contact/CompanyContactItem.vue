<template>
    <div
        class="row item mb-2"
        :class="{
            active: contact.status && !contact.isMain,
            isMain: contact.isMain
        }"
    >
        <div class="col-12 text-center general-info py-2">
            <div class="head row mb-0">
                <div class="index col-12 p-0 text-center">
                    <!-- <i
                      class="fas fa-times text-danger delete"
                      @click="deleteContact"
                      v-if="!contact.type && !reedOnly"
                    ></i> -->
                    <i v-if="contact.warning" class="fas fa-exclamation-circle mr-2 text-danger" title="Внимание"></i>
                    <i v-if="contact.good" class="fas fa-smile mr-2 text-success" title="Хорошие взаимоотношения"></i>
                    <i
                        v-if="contact.faceToFaceMeeting"
                        class="fas fa-street-view mr-2 text-dark"
                        title="Очная встреча"
                    ></i>
                    <i
                        v-if="!contact.type && !reedOnly"
                        @click="openContactFormForUpdate"
                        class="fas fa-pen text-primary edit"
                    ></i>
                </div>
            </div>
            <div v-if="!contact.status" class="text-center mb-1">
                <h4 class="text-warning">Пассив!</h4>
                <p class="text-dark">
                    <b>{{ passiveWhyOptions[contact.passive_why].label }}</b>
                </p>
                <p class="text-dark d-block">{{ contact.passive_why_comment }}</p>
                <hr />
            </div>
            <div v-if="contact.warning" class="text-center mb-1">
                <h4 class="text-danger">Внимание!</h4>
                <p class="text-dark d-block">{{ contact.warning_why_comment }}</p>
                <hr />
            </div>
            <div class="name">
                <strong :title="contact.full_name"> {{ name }} </strong>
                <small class="d-block text-grey">{{ position ? position : 'должность неизвестна' }}</small>
            </div>

            <div class="body">
                <div class="way-list">
                    <i
                        v-for="way of contact.wayOfInformings"
                        :key="way.id"
                        class="px-1 text-info"
                        :title="getWayTitle(way.way)"
                        :class="getWayClass(way.way)"
                    ></i>
                </div>
                <div v-if="!contact.phones.length && !contact.emails.length">нет данных</div>
                <div class="phone-list">
                    <PhoneNumber v-for="phone of contact.phones" :key="phone.id" :phone="phone" :contact="contact" />
                </div>

                <div class="email-list">
                    <a v-for="email in contact.emails" :key="email.id" :href="'mailto:' + email.email" class="d-block">
                        {{ email.email }}
                    </a>
                </div>
                <i
                    v-if="!extraInfoVisible"
                    @click="openExtraInfo"
                    class="far fa-arrow-alt-circle-down d-block open-extra-info mt-1"
                    title="Комментарии"
                ></i>
                <i
                    v-if="extraInfoVisible"
                    @click="closeExtraInfo"
                    class="far fa-arrow-alt-circle-up d-block open-extra-info mt-1"
                ></i>
                <hr />
                <div v-if="extraInfoVisible" class="extra-info row">
                    <div v-if="contact.contactComments.length" class="col-12 comment-list text-left">
                        <Loader v-if="createCommentLoader" class="center small" />
                        <div v-for="comment in contact.contactComments" :key="comment.id" class="comment">
                            <strong>{{ comment.author.userProfile.short_name }}</strong>
                            <p>{{ comment.comment }}</p>
                            <small class="text-grey">{{ comment.created_at }}</small>
                        </div>
                        <hr />
                    </div>
                    <div v-else class="col-12">
                        <Loader v-if="createCommentLoader" class="center small" />
                        <p>комментарий нет</p>
                    </div>
                    <div class="col-12 mt-2">
                        <textarea v-model="comment"></textarea>
                        <button @click="createComment" class="btn btn-primary btn-large">Отправить</button>
                    </div>
                </div>
            </div>
            <div class="footer row mt-1">
                <div v-if="contact.consultant" class="col-12 consultant text-left">
                    <p>ведет: {{ contact.consultant.userProfile.short_name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { FeedbackIcons, PassiveWhyContact, PositionList } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'CompanyContactItem',
    components: {
        Loader
    },
    emits: ['openContactFormForUpdate', 'deleteContact', 'createComment'],
    props: {
        contact: {
            type: Object
        },
        createCommentLoader: {
            type: Boolean
        },
        reedOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            extraInfoVisible: false,
            comment: ''
        };
    },
    computed: {
        wayOfInformings: () => FeedbackIcons,
        positionList: () => PositionList,
        passiveWhyOptions: () => PassiveWhyContact,
        name() {
            if (this.contact.type) {
                return 'Общий контакт';
            }
            return this.contact.first_and_last_name;
        },
        position() {
            return this.positionList[this.contact.position]?.label;
        }
    },
    methods: {
        getWayClass(way) {
            return this.wayOfInformings[way].icon;
        },
        getWayTitle(way) {
            return this.wayOfInformings[way].name;
        },
        openExtraInfo() {
            this.extraInfoVisible = true;
        },
        closeExtraInfo() {
            this.extraInfoVisible = false;
        },
        openContactFormForUpdate() {
            this.$emit('openContactFormForUpdate', this.contact);
        },
        createComment() {
            let data = {
                contact_id: this.contact.id,
                comment: this.comment
            };
            this.comment = null;
            this.$emit('createComment', data);
        },
        deleteContact() {
            let data = {
                ...this.contact
            };
            data.header = this.name;
            this.$emit('deleteContact', data);
        }
    }
};
</script>

<style></style>
