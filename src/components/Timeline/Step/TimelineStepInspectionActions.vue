<template>
    <div class="step-action">
        <teleport to="body">
            <transition
                mode="out-in"
                enter-active-class="animate__animated animate__zoomIn for__modal"
                leave-active-class="animate__animated animate__zoomOut for__modal"
            >
                <Modal
                    title="Отправка"
                    v-if="sendObjectsModalVisible || sendRouteModalVisible"
                    class="autosize"
                    @close="closeSendModal"
                >
                    <FormLetter
                        @send="sendLetter"
                        :formdata="
              sendRouteModalVisible ? sendRouteFormData : sendObjectsFormdata
            "
                        :loader="loader"
                    >
                        <div class="objects" v-if="sendObjectsModalVisible">
                            <CompanyObjectsList
                                :objects="selectedObjects"
                                :selectedObjects="selectedObjects"
                                :disabled="true"
                                col="col-3"
                                label="Выбранные предложения"
                                @select="select"
                                @unSelect="unSelect"
                                @addComment="addComment"
                            />
                        </div>
                    </FormLetter>
                </Modal>
            </transition>
        </teleport>
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row pb-2 mx-0">
                    <div class="col-12">
                        <div class="timeline-actions row">
                            <TimelineStepInspection
                                :step="step"
                                :disabled="disabled"
                                :objects="step.timelineStepObjects"
                                :buttons="buttons"
                                @done="done"
                                @send="openSendObjectsModal"
                                @sendRoute="openSendRouteModal"
                                @negative="negative"
                                @updateItem="clickUpdateStep"
                            />
                        </div>
                    </div>
                </div>
                <hr/>
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <CompanyObjectsList
                                :objects="submittedObjects"
                                :disabled="true"
                                :loader="loader"
                                :viewMode="viewMode"
                                :currentStepId="step.id"
                                :label="
                  'Выбранные предложения' +
                  (submittedObjects.length
                    ? ` (${submittedObjects.length})`
                    : '')
                "
                                class="success"
                                v-if="submittedObjects?.length"
                            />
                            <CompanyObjectsList
                                :objects="notSubmittedObjects"
                                :currentObjects="step.timelineStepObjects"
                                :selectedObjects="selectedObjects"
                                :disabled="disabled"
                                :withSeparator="true"
                                :loader="loader"
                                :viewMode="viewMode"
                                :currentStepId="step.id"
                                :label="
                  submittedObjects?.length
                    ? `Оставшиеся предложения (${notSubmittedObjects.length})`
                    : ''
                "
                                @select="select"
                                @unSelect="unSelect"
                                @addComment="addComment"
                                v-if="
                  notSubmittedObjects.length ||
                  (!submittedObjects.length && !notSubmittedObjects.length)
                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import {MixinWithSendLetter} from "@/components/Company/Object/mixins.js";
import {InspectionDoneComment, InspectionOffersNotFound,} from "@/components/Timeline/comments.js";
import {LetterSenderMixin, MixinStepActions} from "@/components/Timeline/mixins.js";
import Modal from "@/components/common/Modal.vue";
import FormLetter from "@/components/Forms/FormLetter.vue";
import CompanyObjectsList from "@/components/Company/Object/CompanyObjectList.vue";
import TimelineStepInspection from "@/components/Timeline/Step/TimelineStepInspection.vue";

export default {
    name: "TimelineStepInspectionActions",
    mixins: [MixinStepActions, MixinWithSendLetter, LetterSenderMixin],
    components: {
        TimelineStepInspection,
        CompanyObjectsList,
        FormLetter,
        Modal
    },
    data() {
        return {
            sendRouteModalVisible: false,
            routeLink: null,
            sendRouteFormData: null,
        };
    },
    computed: {
        ...mapGetters(["CURRENT_STEP_OBJECTS"]),
        currentStepObjects() {
            let array = [];
            let objectItem = null;
            this.step.timelineStepObjects.map((item) => {
                objectItem = this.preventStepObjects.find(
                    (object) => object.original_id == item.object_id
                );
                if (objectItem) {
                    array.push(objectItem);
                }
            });
            return array;
        },
        buttons() {
            return [
                {
                    btnClass: "primary",
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: "Сохранить",
                    text: "Готово",
                    icon: "fas fa-check",
                    emited_event: "done",
                    classes: "col-2",
                },
                {
                    btnClass: "success",
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: "Отправить презентации с объектами клиенту",
                    text: "Отправить клиенту",
                    icon: "fas fa-paper-plane",
                    withWayOfSending: true,
                    emited_event: "send",
                    classes: "col-2 ml-1",
                },
                {
                    btnClass: "danger",
                    btnVisible: false,
                    defaultBtn: true,
                    btnActive: this.step.negative,
                    disabled: this.disabled,
                    title: "Отправить презентации с объектами клиенту",
                    text: "Нет подходящих",
                    icon: "far fa-frown-open",
                    emited_event: "negative",
                    classes: "col-2 ml-1",
                },
            ];
        },
    },
    methods: {
        updatedObjects(data, fn = null) {
            this.$emit("updatedObjects", data, false, fn);
        },
        getNegativeComment(step) {
            return [new InspectionOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new InspectionDoneComment(step, this.selectedObjects)];
        },
        openSendRouteModal(routeLink, sendToClient) {
            this.routeLink = routeLink;
            this.setSendRouteFormData(sendToClient);
            this.sendRouteModalVisible = true;
            return;
        },
        setSendRouteFormData(selfSend) {
            const formdata = {
                subject: "Маршрут по предложенным объектам от Pennylane Realty",
                wayOfSending: [0],
                selfSend: selfSend ? 1 : 0,
                company_id: this.currentRequest.company_id,
                message: `<span>Маршрут на Яндекс-Картах по предложенным объектам доступен по <a href=${this.routeLink}>ссылке</a></span><p>С уважением, ${this.THIS_USER.userProfile.medium_name}</p><p>менеджер PLR</p>`,
            };
            if (this.defaultContactForSend !== null) {
                formdata.defaultContactForSend = selfSend
                    ? {}
                    : {
                        id: this.defaultContactForSend.id,
                        type: 1,
                    };
            }

            this.sendRouteFormData = formdata;
        },
        closeSendModal() {
            this.sendRouteModalVisible = false;
            this.closeSendObjectsModal();
        },
        sendLetter(form) {
            this.sendOffers(form);
            this.closeSendModal();
        },
    },
};
</script>

<style>
</style>