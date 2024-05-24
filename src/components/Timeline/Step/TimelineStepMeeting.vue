<template>
    <div v-if="data" class="col-12">
        <FormModalEvent
            v-if="notificationFormVisible"
            @close="closeNotificationForm"
            @created="createdOrUpdatedEvent"
            @updated="createdOrUpdatedEvent"
            :formdata="{ consultant_id: THIS_USER.id }"
        />
        <div class="row no-gutters">
            <div class="col-12">
                <TimelineStepStage
                    :id="1"
                    @stageClicked="stageClicked"
                    class="mb-2"
                    title="Шаг 1. Изучите деятельность компании клиента, свяжитесь с контактным лицом и обсудите задачу"
                    :is-done="data.additional == 1"
                    :is-current="data.additional != 1"
                    :is-clicked="clickedStage === 1"
                >
                    <ButtonList
                        v-if="!disabled"
                        @phoned="selectPhoned"
                        @callback="openNotificationForm"
                        @negative="selectNegative"
                        :buttons="buttonsOne"
                    />
                </TimelineStepStage>
                <TimelineStepStage
                    :id="2"
                    @stageClicked="stageClicked"
                    title="Шаг 2. Проверьте правильность заполнения запроса, отредактируйте при необходимости и затем утвердите"
                    :is-done="data.done == 1"
                    :is-current="data.additional == 1"
                    :is-clicked="clickedStage === 2"
                >
                    <ButtonList
                        v-if="!disabled"
                        @done="selectDone"
                        @updateRequest="openRequestForm"
                        :buttons="buttonsTwo"
                    />
                </TimelineStepStage>
            </div>
        </div>
    </div>
</template>

<script>
import { MixinSteps } from '@/components/Timeline/mixins.js';
import { mapGetters } from 'vuex';
import {
    CallbackComment,
    CallingErrorComment,
    MeetingDoneComment,
    PhonedComment
} from '@/components/Timeline/comments.js';
import FormModalEvent from '@/components/Forms/FormModalEvent.vue';

export default {
    name: 'TimelineStepMeeting',
    components: {
        FormModalEvent
    },
    mixins: [MixinSteps],
    emits: ['updateItem', 'openRequestForm', 'stageChanged'],
    data() {
        return {
            notificationFormVisible: false,
            clickedStage: null
        };
    },
    computed: {
        ...mapGetters(['THIS_USER']),
        buttonsOne() {
            return [
                {
                    btnClass: 'success',
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: this.disabled,
                    btnActive: this.data.additional == 1,
                    title: '',
                    text: 'Поговорил',
                    emited_event: 'phoned',
                    withWayOfSending: false,
                    classes: 'col-2 pr-1'
                },
                {
                    btnClass: 'primary',
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: this.disabled,
                    btnActive: this.data.additional == 2,
                    title: '',
                    text: 'Перезвонить',
                    emited_event: 'callback',
                    withWayOfSending: false,
                    classes: 'col-2 px-1'
                },
                {
                    btnClass: 'danger',
                    btnVisible: false,
                    defaultBtn: true,
                    btnActive: this.data.negative,
                    disabled: this.disabled,
                    title: '',
                    text: 'Не дозвонился',
                    emited_event: 'negative',
                    withWayOfSending: false,
                    classes: 'col-2 pl-1'
                }
            ];
        },
        buttonsTwo() {
            return [
                {
                    btnClass: 'success',
                    btnVisible: false,
                    defaultBtn: true,
                    disabled: this.disabled,
                    btnActive: this.data.done,
                    title: '',
                    text: 'Отлично, идём дальше',
                    emited_event: 'done',
                    withWayOfSending: false,
                    classes: 'col-4 col-xl-3 col-xxl-2 pr-1'
                }
            ];
        }
    },
    methods: {
        closeNotificationForm() {
            this.notificationFormVisible = false;
        },
        openNotificationForm() {
            this.notificationFormVisible = true;
        },
        openRequestForm() {
            this.$emit('openRequestForm');
        },
        createdOrUpdatedEvent(newCalendarEvent) {
            this.closeNotificationForm();
            this.selectCallback(newCalendarEvent);
        },
        selectDone() {
            if (this.data.done) {
                this.data.done = 0;
                this.data.newActionComments = [];
                this.data.status = 0;
            } else {
                this.data.done = 1;
                this.data.status = 1;
                this.data.newActionComments = [new MeetingDoneComment(this.data)];
            }
            this.$emit('updateItem', this.data, this.data.done);
        },
        selectNegative() {
            if (this.data.negative) {
                this.data.negative = 0;
                this.data.newActionComments = [];
            } else {
                this.data.negative = 1;
                this.data.additional = 0;
                this.data.date = null;
                this.data.newActionComments = [new CallingErrorComment(this.data)];
            }

            this.$emit('updateItem', this.data);
        },

        selectPhoned() {
            if (this.data.additional == 1) {
                this.data.additional = 0;
                this.data.newActionComments = [];
            } else {
                this.data.additional = 1;
                this.data.newActionComments = [new PhonedComment(this.data)];
            }
            this.data.negative = 0;
            this.data.date = null;
            this.$emit('updateItem', this.data);
        },
        selectCallback(newCalendarEvent) {
            this.data.additional = 2;
            this.data.date = newCalendarEvent.startDate;
            this.data.newActionComments = [
                new CallbackComment(
                    this.data,
                    this.$formatter.date().locale(this.data.date, 'ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    })
                )
            ];
            this.data.negative = 0;
            this.$emit('updateItem', this.data);
        },
        stageClicked(id) {
            this.clickedStage = id;
            this.$emit('stageChanged', id);
        }
    }
};
</script>

<style></style>
