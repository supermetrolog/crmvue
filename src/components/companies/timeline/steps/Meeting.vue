<template>
  <div class="col-12" v-if="data">
    <EventFormInModal
      @close="closeNotificationForm"
      @created="createdOrUpdatedEvent"
      @updated="createdOrUpdatedEvent"
      :formdata="{ consultant_id: THIS_USER.id }"
      v-if="notificationFormVisible"
    />
    <div class="row no-gutters">
      <div class="col-12">
        <StepStage
          class="mb-2"
          title="Шаг 1. Изучите деятельность компании клиента, свяжитесь с контактным лицом и обсудите задачу"
          :isDone="data.additional == 1"
          :isCurrent="data.additional != 1"
          :id="1"
          :isClicked="clickedStage === 1"
          @stageClicked="stageClicked"
        >
          <ButtonList
            :buttons="buttonsOne"
            @phoned="selectPhoned"
            @callback="openNotificationForm"
            @negative="selectNegative"
          />
        </StepStage>
        <StepStage
          title="Шаг 2. Проверьте правильность заполнения запроса, отредактируйте при необходимости и затем утвердите"
          :isDone="data.done == 1"
          :isCurrent="data.additional == 1"
          :id="2"
          :isClicked="clickedStage === 2"
          @stageClicked="stageClicked"
        >
          <ButtonList
            :buttons="buttonsTwo"
            @done="selectDone"
            @updateRequest="openRequestForm"
          />
        </StepStage>
      </div>
    </div>
  </div>
</template>

<script>
import EventFormInModal from "@/components/calendar/forms/event/EventFormInModal.vue";
import { MixinSteps } from "../mixins";
import { mapGetters } from "vuex";
import {
  PhonedComment,
  CallbackComment,
  CallingErrorComment,
  MeetingDoneComment,
} from "../comments/commenst";
export default {
  name: "Meeting",
  mixins: [MixinSteps],
  components: {
    EventFormInModal,
  },
  data() {
    return {
      notificationFormVisible: false,
      clickedStage: null,
    };
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
    buttonsOne() {
      return [
        {
          btnClass: "success",
          btnVisible: false,
          defaultBtn: true,
          disabled: this.disabled,
          btnActive: this.data.additional == 1,
          title: "",
          text: "Поговорил",
          emited_event: "phoned",
          withWayOfSending: false,
          classes: "col-2 pr-1",
        },
        {
          btnClass: "primary",
          btnVisible: false,
          defaultBtn: true,
          disabled: this.disabled,
          btnActive: this.data.additional == 2,
          title: "",
          text: "Перезвонить",
          emited_event: "callback",
          withWayOfSending: false,
          classes: "col-2 px-1",
        },
        {
          btnClass: "danger",
          btnVisible: false,
          defaultBtn: true,
          btnActive: this.data.negative,
          disabled: this.disabled,
          title: "",
          text: "Не дозвонился",
          emited_event: "negative",
          withWayOfSending: false,
          classes: "col-2 pl-1",
        },
      ];
    },
    buttonsTwo() {
      return [
        {
          btnClass: "success",
          btnVisible: false,
          defaultBtn: true,
          disabled: this.disabled,
          btnActive: this.data.done,
          title: "",
          text: "Отлично, идём дальше",
          emited_event: "done",
          withWayOfSending: false,
          classes: "col-2 pr-1",
        },
      ];
    },
  },
  methods: {
    closeNotificationForm() {
      this.notificationFormVisible = false;
    },
    openNotificationForm() {
      this.notificationFormVisible = true;
    },
    openRequestForm() {
      this.$emit("openRequestForm");
    },
    createdOrUpdatedEvent(newCalendarEvent) {
      console.log(newCalendarEvent);
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
      this.$emit("updateItem", this.data, this.data.done);
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

      this.$emit("updateItem", this.data);
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
      this.$emit("updateItem", this.data);
    },
    selectCallback(newCalendarEvent) {
      this.data.additional = 2;
      this.data.date = newCalendarEvent.startDate;
      this.data.newActionComments = [
        new CallbackComment(
          this.data,
          this.$formatter.date().locale(this.data.date, "ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
        ),
      ];
      this.data.negative = 0;
      this.$emit("updateItem", this.data);
    },
    stageClicked(id) {
      this.clickedStage = id;
      this.$emit("stageChanged", id);
    },
  },
  emits: ["updateItem", "openRequestForm", "stageChanged"],
};
</script>

<style>
</style>