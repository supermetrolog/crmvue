<template>
  <div class="col">
    <Modal v-show="modalVisible" @close="closeModal" title="Предложения">
      <template #body>
        <!-- <ObjectsGrid @close="closeModal" /> -->
      </template>
    </Modal>
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
import Modal from "@/components/Modal";
// import ObjectsGrid from "@/components/companies/timelineStepObjects/ObjectsGrid";
export default {
  name: "Meeting",
  components: {
    Modal,
    // ObjectsGrid,
  },
  data() {
    return {
      timelineStepObjects: [],
      negative: 0,
      additional: 0,
      modalVisible: false,
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
      this.timelineStepObjects = this.actions.timelineStepObjects;
      this.negative = this.actions.negative;
      this.additional = this.actions.additional;
    },
    getData() {
      return {
        timelineStepObjects: this.timelineStepObjects,
        negative: this.negative,
        additional: this.additional,
      };
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
    clickSelectObjects() {
      this.showModal();
    },
    closeModal() {
      this.modalVisible = false;
    },
    showModal() {
      this.modalVisible = true;
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