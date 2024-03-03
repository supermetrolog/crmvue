<template>
    <div class="step-action">
        <teleport to="body">
            <Modal
                v-if="sendObjectsModalVisible || sendRouteModalVisible"
                @close="closeSendModal"
                title="Отправка"
                class="modal-form-letter"
            >
                <FormLetter
                    @send="sendLetter"
                    :formdata="sendRouteModalVisible ? sendRouteFormData : sendObjectsFormdata"
                    :loader="loader"
                >
                    <div v-if="sendObjectsModalVisible" class="objects">
                        <CompanyObjectsList
                            @select="select"
                            @unSelect="unSelect"
                            @addComment="addComment"
                            :objects="selectedObjects"
                            :selected-objects="selectedObjects"
                            :disabled="true"
                            col="col-3"
                            label="Выбранные предложения"
                        />
                    </div>
                </FormLetter>
            </Modal>
        </teleport>
        <div class="row no-gutters inner scroller">
            <div class="col-12">
                <div class="row pb-2 mx-0">
                    <div class="col-12">
                        <div class="timeline-actions row">
                            <TimelineStepInspection
                                @done="done"
                                @send="openSendObjectsModal"
                                @sendRoute="openSendRouteModal"
                                @negative="negative"
                                @updateItem="clickUpdateStep"
                                :step="step"
                                :disabled="disabled"
                                :objects="step.timelineStepObjects"
                                :buttons="buttons"
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-12">
                        <div class="objects">
                            <CompanyObjectsList
                                v-if="submittedObjects?.length"
                                :objects="submittedObjects"
                                :disabled="true"
                                :loader="loader"
                                :view-mode="viewMode"
                                :current-step-id="step.id"
                                :label="
                                    'Выбранные предложения' +
                                    (submittedObjects.length ? ` (${submittedObjects.length})` : '')
                                "
                                class="success"
                            />
                            <CompanyObjectsList
                                v-if="
                                    notSubmittedObjects.length ||
                                    (!submittedObjects.length && !notSubmittedObjects.length)
                                "
                                @select="select"
                                @unSelect="unSelect"
                                @addComment="addComment"
                                :objects="notSubmittedObjects"
                                :current-objects="step.timelineStepObjects"
                                :selected-objects="selectedObjects"
                                :disabled="disabled"
                                :with-separator="true"
                                :loader="loader"
                                :view-mode="viewMode"
                                :current-step-id="step.id"
                                :label="
                                    submittedObjects?.length
                                        ? `Оставшиеся предложения (${notSubmittedObjects.length})`
                                        : ''
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
import { mapGetters } from 'vuex';
import { MixinWithSendLetter } from '@/components/Company/Object/mixins.js';
import { InspectionDoneComment, InspectionOffersNotFound } from '@/components/Timeline/comments.js';
import { LetterSenderMixin, MixinStepActions } from '@/components/Timeline/mixins.js';
import Modal from '@/components/common/Modal.vue';
import FormLetter from '@/components/Forms/FormLetter.vue';
import TimelineStepInspection from '@/components/Timeline/Step/TimelineStepInspection.vue';

export default {
    name: 'TimelineStepInspectionActions',
    components: {
        TimelineStepInspection,
        FormLetter,
        Modal
    },
    mixins: [MixinStepActions, MixinWithSendLetter, LetterSenderMixin],
    data() {
        return {
            sendRouteModalVisible: false,
            routeLink: null,
            sendRouteFormData: null
        };
    },
    computed: {
        ...mapGetters(['CURRENT_STEP_OBJECTS']),
        currentStepObjects() {
            let array = [];
            let objectItem = null;
            this.step.timelineStepObjects.map(item => {
                objectItem = this.preventStepObjects.find(
                    object => object.original_id == item.object_id
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
                    btnClass: 'primary',
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: 'Сохранить',
                    text: 'Готово',
                    icon: 'fas fa-check',
                    emited_event: 'done',
                    classes: 'col-2'
                },
                {
                    btnClass: 'success',
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: !this.selectedObjects.length || this.disabled,
                    title: 'Отправить презентации с объектами клиенту',
                    text: 'Отправить клиенту',
                    icon: 'fas fa-paper-plane',
                    withWayOfSending: true,
                    emited_event: 'send',
                    classes: 'col-2 ml-1'
                },
                {
                    btnClass: 'danger',
                    btnVisible: false,
                    defaultBtn: true,
                    btnActive: this.step.negative,
                    disabled: this.disabled,
                    title: 'Отправить презентации с объектами клиенту',
                    text: 'Нет подходящих',
                    icon: 'far fa-frown-open',
                    emited_event: 'negative',
                    classes: 'col-2 ml-1'
                }
            ];
        }
    },
    methods: {
        updatedObjects(data, fn = null) {
            this.$emit('updatedObjects', data, false, fn);
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
                subject: 'Маршрут по предложенным объектам от Pennylane Realty',
                wayOfSending: [0],
                selfSend: selfSend ? 1 : 0,
                company_id: this.currentRequest.company_id,
                message: `<span>Маршрут на Яндекс-Картах по предложенным объектам доступен по <a href=${this.routeLink}>ссылке</a></span><p>С уважением, ${this.THIS_USER.userProfile.medium_name}</p><p>менеджер PLR</p>`
            };
            if (this.defaultContactForSend !== null) {
                formdata.defaultContactForSend = selfSend
                    ? {}
                    : {
                          id: this.defaultContactForSend.id,
                          type: 1
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
        }
    }
};
</script>

<style></style>
