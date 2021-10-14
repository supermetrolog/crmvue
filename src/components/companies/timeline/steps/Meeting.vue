<template>
  <div class="col-12" v-if="data">
    <div class="row no-gutters" v-if="data.additional != 1">
      <div class="col-4 pr-1">
        <button
          class="action"
          :class="{ active: data.additional == 1 }"
          @click="clickTogglePhoned"
        >
          <i class="fas fa-phone-volume"></i>
          Дозвонился
        </button>
      </div>
      <div class="col-4 px-1">
        <button
          class="action"
          :class="{ active: data.additional == 2 }"
          @click="clickToggleCallback"
        >
          <i class="fas fa-calendar-alt"></i>
          Перезвонить
        </button>

        <div
          class="actions d-inline-block text-center mt-2"
          v-if="actionsVisible"
        >
          <input type="date" class="action mb-1" v-model="callBackDate" />
          <button class="btn-action text-success" @click="confirm">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn-action text-danger" @click="cancel">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="col-4 pl-1">
        <button
          class="action danger"
          :class="{ active: data.negative }"
          @click="clickToggleNegative"
        >
          <i class="fas fa-phone-slash"></i>
          Не дозвонился
        </button>
      </div>
    </div>
    <div class="row no-gutters" v-if="data.additional == 1">
      <div class="col-6 pr-1">
        <button
          class="action"
          :class="{ active: data.done }"
          @click="clickToggleDone"
        >
          <i class="fas fa-check"></i>
          Утвердил запрос
        </button>
      </div>
      <div class="col-6 pr-1">
        <button
          class="action bg-dark text-light"
          @click="$emit('openRequestFormForUpdate')"
        >
          <i class="fas fa-pencil-alt"></i>
          Редактировать запрос
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Meeting",
  data() {
    return {
      data: null,
      callBackDate: null,
      actionsVisible: false,
    };
  },
  props: {
    step: {
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
  },
  mounted() {
    this.data = this.step;
    if (this.data.date) {
      this.callBackDate = this.data.date.substr(0, 10);
      this.actionsVisible = true;
    }
  },
  methods: {
    clickToggleDone() {
      if (this.data.done) {
        this.data.done = 0;
        this.data.newActionComments = [];
      } else {
        this.data.done = 1;
        this.data.newActionComments = [
          {
            timeline_step_id: this.data.id,
            title: "система",
            comment: "Утвердил запрос",
          },
        ];
      }
      this.$emit("updateItem", this.data, this.data.done);
    },
    clickToggleNegative() {
      if (this.data.negative) {
        this.data.negative = 0;
        this.data.newActionComments = [];
      } else {
        this.data.negative = 1;
        this.data.newActionComments = [
          {
            timeline_step_id: this.data.id,
            title: "система",
            comment: "Не дозвонился",
          },
        ];
      }
      this.data.additional = 0;
      this.data.date = null;
      this.callBackDate = null;
      this.actionsVisible = false;
      this.$emit("updateItem", this.data);
    },
    clickTogglePhoned() {
      if (this.data.additional == 1) {
        this.data.additional = 0;
        this.data.newActionComments = [];
      } else {
        this.data.additional = 1;
        this.data.newActionComments = [
          {
            timeline_step_id: this.data.id,
            title: "система",
            comment: "Дозвонился",
          },
        ];
      }
      this.data.negative = 0;
      this.data.date = null;
      this.callBackDate = null;
      this.actionsVisible = false;
      this.$emit("updateItem", this.data);
    },
    clickToggleCallback() {
      this.callBackDate = this.data.date;
      this.actionsVisible = true;
    },
    cancel() {
      this.actionsVisible = false;
    },
    confirm() {
      this.data.additional = 2;
      this.data.newActionComments = [
        {
          timeline_step_id: this.data.id,
          title: "система",
          comment: `Установил напоминание "позвонить к ${this.callBackDate}"`,
        },
      ];
      this.data.negative = 0;
      this.data.date = this.callBackDate;
      this.$emit("updateItem", this.data);
    },
  },
  emits: ["updateItem", "openRequestFormForUpdate"],
};
</script>

<style>
</style>