<template>
  <div class="col-12" v-if="data">
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal absolute"
        leave-active-class="animate__animated animate__zoomOut for__modal absolute"
      >
        <NotificationForm
          @close="closeNotificationForm"
          v-if="notificationFormVisible"
        />
      </transition>
    </teleport>
    <div class="row no-gutters">
      <div class="col-12">
        <StepStage
          class="mb-2"
          title="Шаг 1. Изучите деятельность компании клиента, свяжитесь с контактным лицом и обсудите задачу"
          :isDone="data.additional == 1"
          :isCurrent="data.additional != 1"
        >
          <StepActions
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
        >
          <StepActions
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
import StepActions from "./actions/StepActions.vue";
import NotificationForm from "@/components/notifications/forms/NotificationForm.vue";
import StepStage from "./steps-stages/StepStage.vue";
import { MixinSteps } from "../mixins";
import { mapGetters } from "vuex";
export default {
  name: "Meeting",
  mixins: [MixinSteps],
  components: {
    StepActions,
    NotificationForm,
    StepStage,
  },
  data() {
    return {
      callBackDate: null,
      notificationFormVisible: false,
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
          icon: "fas fa-phone-volume",
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
          icon: "fas fa-calendar-alt",
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
          icon: "fas fa-phone-slash",
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
          icon: "fas fa-check",
          emited_event: "done",
          withWayOfSending: false,
          classes: "col-2 pr-1",
        },
      ];
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      if (this.data.date) {
        this.callBackDate = this.data.date.substr(0, 10);
      }
    },
    closeNotificationForm() {
      this.notificationFormVisible = false;
    },
    openNotificationForm() {
      this.notificationFormVisible = true;
    },
    openRequestForm() {
      this.$emit("openRequestForm");
    },
    selectDone(comment) {
      if (this.data.done) {
        this.data.done = 0;
        this.data.newActionComments = [];
        this.data.status = 0;
      } else {
        this.data.done = 1;
        let actionComment = "Утвердил запрос";
        let title = "система";
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
          title = "система/" + this.THIS_USER.userProfile.short_name;
        }
        this.data.newActionComments = [
          {
            timeline_id: this.data.timeline_id,
            timeline_step_id: this.data.id,
            timeline_step_number: this.data.number,
            title: title,
            comment: actionComment,
            type: 1,
          },
        ];
        this.data.status = 1;
      }
      this.$emit("updateItem", this.data, this.data.done);
    },
    selectNegative(comment) {
      if (this.data.negative) {
        this.data.negative = 0;
        this.data.newActionComments = [];
      } else {
        this.data.negative = 1;
        let actionComment = "Не дозвонился";
        let title = "система";
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
          title = "система/" + this.THIS_USER.userProfile.short_name;
        }
        this.data.newActionComments = [
          {
            timeline_id: this.data.timeline_id,
            timeline_step_id: this.data.id,
            timeline_step_number: this.data.number,
            title: title,
            comment: actionComment,
            type: 1,
          },
        ];
      }
      this.data.additional = 0;
      this.data.date = null;
      this.callBackDate = null;
      this.$emit("updateItem", this.data);
    },
    selectPhoned(comment) {
      if (this.data.additional == 1) {
        this.data.additional = 0;
        this.data.newActionComments = [];
      } else {
        this.data.additional = 1;
        let actionComment = "Дозвонился";
        let title = "система";
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
          title = "система/" + this.THIS_USER.userProfile.short_name;
        }
        this.data.newActionComments = [
          {
            timeline_id: this.data.timeline_id,
            timeline_step_id: this.data.id,
            timeline_step_number: this.data.number,
            title: title,
            comment: actionComment,
            type: 1,
          },
        ];
      }
      this.data.negative = 0;
      this.data.date = null;
      this.callBackDate = null;
      this.$emit("updateItem", this.data);
    },
    selectCallback(comment) {
      if (this.data.additional == 2) {
        this.data.additional = 0;
        this.data.newActionComments = [];
        this.data.date = null;
        this.callBackDate = null;
      } else {
        if (!this.callBackDate) {
          return;
        }
        this.data.additional = 2;
        let actionComment = `Установил напоминание "позвонить к ${this.callBackDate}"`;
        let title = "система";
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
          title = "система/" + this.THIS_USER.userProfile.short_name;
        }
        this.data.newActionComments = [
          {
            timeline_id: this.data.timeline_id,
            timeline_step_id: this.data.id,
            timeline_step_number: this.data.number,
            title: title,
            comment: actionComment,
            type: 1,
          },
        ];
        this.data.date = this.callBackDate;
      }
      this.data.negative = 0;
      this.$emit("updateItem", this.data);
    },
  },
  watch: {
    step() {
      this.setData();
    },
  },
  emits: ["updateItem", "openRequestForm"],
};
</script>

<style>
</style>