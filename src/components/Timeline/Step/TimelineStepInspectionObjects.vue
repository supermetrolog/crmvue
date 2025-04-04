<template>
    <div class="timeline-step">
        <teleport to="body">
            <Modal
                @close="sendModalIsVisible = false"
                :show="sendModalIsVisible"
                title="Выбор заинтересовавших предложений"
                width="1200"
            >
                <FormLetter
                    @send="localSend"
                    :formdata="preparedLetterMessage"
                    :loading="isSending"
                >
                    <CompanyObjectsList
                        @select="select"
                        @unselect="unselect"
                        @addComment="addComment"
                        :objects="selectedObjects"
                        :selected-objects="selectedObjects"
                        :disabled="true"
                        col="col-3"
                        label="Выбранные предложения"
                    />
                </FormLetter>
            </Modal>
        </teleport>
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="4. Организация осмотра объектов"
                    :success="data.objects.length"
                    :step
                    :timeline="TIMELINE"
                >
                    <p>4.1. Отметьте объекты, которые клиент хотел бы осмотреть</p>
                    <p v-if="data.objects.length">
                        На данный момент клиента
                        {{ infoText }}.
                    </p>
                    <template #footer>
                        <div class="d-flex gap-2 flex-wrap align-items-center">
                            <TimelineButton
                                @click="submit"
                                tooltip="Нажмите, чтобы сохранить результат"
                                :disabled="!selectedObjects.length || disabled"
                            >
                                <span>Готово</span>
                                <i class="fa-solid fa-thumbs-up icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                @click="sendModalIsVisible = true"
                                tooltip="Нажмите, чтобы отправить презентации с объектами клиенту"
                                :disabled="!selectedObjects.length || disabled"
                                color="success"
                            >
                                <span>Отправить презентации</span>
                                <i class="fa-solid fa-paper-plane icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                @click="selectNegative"
                                :active="step.negative"
                                :disabled="disabled"
                                color="danger"
                            >
                                <span>Нет подходящих</span>
                                <i class="fa-solid fa-frown-open icon"></i>
                            </TimelineButton>
                        </div>
                    </template>
                </TimelineInfo>
            </div>
            <div class="col-12">
                <CompanyObjectsList
                    v-if="submittedObjects?.length"
                    :objects="submittedObjects"
                    disabled
                    :loader="isGeneralLoading"
                    :view-mode="viewMode"
                    :current-step-id="step.id"
                    :label="submittedObjectsLabel"
                    class="alt"
                />
                <CompanyObjectsList
                    v-if="
                        notSubmittedObjects?.length ||
                        (!submittedObjects?.length && !notSubmittedObjects?.length)
                    "
                    @select="select"
                    @unselect="unselect"
                    @addComment="addComment"
                    :objects="notSubmittedObjects"
                    :current-objects="step.objects"
                    :selected-objects="selectedObjects"
                    :disabled="disabled"
                    with-separator
                    :loader="isGeneralLoading"
                    :view-mode="viewMode"
                    :current-step-id="step.id"
                    :label="notSubmittedObjectsLabel"
                />
            </div>
        </div>
    </div>
</template>

<script>
import {
    TimelineStepWithLetterMixin,
    TimelineStepWithObjectsMixin
} from '@/components/Timeline/mixins.js';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import { plural } from '@/utils/plural.js';
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import FormLetter from '@/components/Forms/FormLetter.vue';
import Modal from '@/components/common/Modal.vue';
import { InspectionDoneComment, InspectionOffersNotFound } from '@/components/Timeline/comments.js';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';

export default {
    name: 'TimelineStepInspectionObjects',
    components: {
        TimelineButton,
        Modal,
        FormLetter,
        CompanyObjectsList,
        TimelineInfo
    },
    mixins: [TimelineStepWithObjectsMixin, TimelineStepWithLetterMixin],
    data() {
        return {
            isAlreadySent: false,
            currentRecommendedFilter: null,
            queryParams: null,
            isSending: false
        };
    },
    computed: {
        infoText() {
            return plural(
                this.data.objects.length,
                'заинтересовал %d объект',
                'заинтересовало %d объекта',
                'заинтересовало %d объектов'
            );
        }
    },
    methods: {
        async submit() {
            await this.done();
            this.$emit('next-step');
        },
        async localSend(event) {
            this.isSending = true;

            const sendingSuccessfully = await this.send(event);

            if (sendingSuccessfully) this.sendModalIsVisible = false;

            this.isSending = false;
        },
        getNegativeComment(step) {
            return [new InspectionOffersNotFound(step)];
        },
        getDoneComment(step) {
            return [new InspectionDoneComment(step, this.selectedObjects)];
        }
    }
};
</script>

<style></style>
