<template>
  <div class="col">
    <div class="row mb-2">
      <div class="col">
        <p>- Установить контакт, подтвердить параметры запроса</p>
        <button
          class="action"
          :class="{ active: done }"
          :disabled="disabled"
          @click="clickToggleDone"
        >
          <i class="far fa-smile"></i>
          Выполнено
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <p>- Подтвердить желаемые даты переезда/покупки</p>
        <input
          class="date-input mb-2 action"
          :class="{ active: dateModel }"
          :disabled="disabled"
          type="date"
          v-model.trim="dateModel"
          @input="inputDate"
        />
        <button
          class="ml-1 mb-2 action"
          :class="{ active: negative }"
          :disabled="disabled || negative"
          @click="clickNegative"
        >
          <i class="far fa-frown-open"></i>
          <span class="ml-1">Нет кокретики по сроку</span>
        </button>
        <button
          class="mb-2 action"
          :class="{ active: additional }"
          :disabled="disabled || additional"
          @click="clickAdditional"
        >
          <i class="fas fa-infinity"></i>
          <span class="ml-1">Рассматривает постоянно</span>
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
      done: 0,
      dateModel: "",
      negative: 0,
      additional: 0,
    };
  },
  props: {
    actions: {
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
    isConfirmed: {
      type: Boolean,
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.dateModel = this.actions.date;
      this.done = this.actions.done;
      this.negative = this.actions.negative;
      this.additional = this.actions.additional;
    },
    getData() {
      return {
        date: this.dateModel,
        done: this.done,
        negative: this.negative,
        additional: this.additional,
      };
    },
    clickToggleDone() {
      this.done ? (this.done = 0) : (this.done = 1);
    },
    clickNegative() {
      this.negative = 1;
      this.dateModel = "";
      this.additional = 0;
    },
    clickAdditional() {
      this.additional = 1;
      this.negative = 0;
      this.dateModel = "";
    },
    inputDate() {
      this.additional = 0;
      this.negative = 0;
    },
  },

  watch: {
    disabled() {
      if (!this.isConfirmed) {
        this.setData();
      }
    },
  },
};
</script>

<style>
</style>