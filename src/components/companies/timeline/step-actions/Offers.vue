<template>
  <div class="col">
    <div class="row">
      <div class="col">
        <p>
          - Посмотреть и отправить подходящие предложения клиенту, при
          необходимости добавить варианты вручную
        </p>
        <button
          class="action"
          :class="{ active: timelineStepObjects.length }"
          :disabled="disabled"
          @click="clickSelectObjects"
        >
          <i class="far fa-smile"></i>
          <span class="ml-1" v-if="timelineStepObjects.length"
            >Отправлено {{ timelineStepObjects.length }}
          </span>
          <span class="ml-1" v-else>Выбрать</span>
        </button>
        <button
          class="ml-1 mb-2 action"
          :class="{ active: negative }"
          :disabled="disabled || negative"
          @click="clickNegative"
        >
          <i class="far fa-frown-open"></i>
          <span class="ml-1">Нет подходящих</span>
        </button>
        <button
          class="mb-2 action"
          :class="{ active: additional }"
          :disabled="disabled || additional"
          @click="clickAdditional"
        >
          <i class="far fa-frown-open"></i>
          <span class="ml-1">Среди подборки нет подходящих</span>
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
      timelineStepObjects: [],
      negative: 0,
      additional: 0,
    };
  },
  props: {
    step: {
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
      this.timelineStepObjects = this.step.timelineStepObjects;
      this.negative = this.step.negative;
      this.additional = this.step.additional;
    },
    getData() {
      let newData = { ...this.step };
      newData.timelineStepObjects = this.timelineStepObjects;
      newData.negative = this.negative;
      newData.additional = this.additional;
      return newData;
    },
    clickNegative() {
      this.timelineStepObjects = [];
      this.negative = 1;
      this.additional = 0;
    },
    clickAdditional() {
      this.timelineStepObjects = [];
      this.additional = 1;
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