<template>
  <div class="col-12" v-if="data">
    <div class="row no-gutters" v-if="data.additional != 1">
      <div class="col-4 pr-1">
        <CustomButton
          :options="{ btnActive: data.additional == 1 }"
          @confirm="selectPhoned"
        >
          <template #btnContent>
            <i class="fas fa-phone-volume"></i>
            Дозвонился
          </template>
        </CustomButton>
      </div>
      <div class="col-4 px-1">
        <CustomButton
          :options="{
            btnActive: data.additional == 2,
            btnVisible: true,
          }"
          @confirm="selectCallback"
        >
          <template #btnContent>
            <i class="fas fa-calendar-alt"></i>
            Перезвонить
          </template>
          <template #extraContent="{ data }">
            <input
              v-if="callBackDate || data.openned"
              type="date"
              class="action mt-1"
              v-model="callBackDate"
              :disabled="!data.openned"
            />
          </template>
        </CustomButton>
      </div>
      <div class="col-4 pl-1">
        <CustomButton
          :options="{ btnActive: data.negative, btnClass: 'danger' }"
          @confirm="selectNegative"
        >
          <template #btnContent>
            <i class="fas fa-phone-slash"></i>
            Не дозвонился
          </template>
        </CustomButton>
      </div>
    </div>
    <div class="row no-gutters" v-if="data.additional == 1">
      <div class="col-6 pr-1">
        <!-- <button
          class="action"
          :class="{ active: data.done }"
          @click="clickToggleDone"
        >
          <i class="fas fa-check"></i>
          Утвердил запрос
        </button> -->
        <CustomButton
          :options="{
            btnActive: data.done,
            btnClass: 'success',
            btnVisible: false,
          }"
          @confirm="selectDone"
        >
          <template #btnContent>
            <i class="fas fa-check"></i>
            Утвердил запрос
          </template>
        </CustomButton>
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
import CustomButton from "@/components/CustomButton.vue";
export default {
  name: "Meeting",
  components: {
    CustomButton,
  },
  data() {
    return {
      data: null,
      callBackDate: null,
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
    selectDone(comment) {
      if (this.data.done) {
        this.data.done = 0;
        this.data.newActionComments = [];
      } else {
        this.data.done = 1;
        let actionComment = "Утвердил запрос";
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
        }
        this.data.newActionComments = [
          {
            timeline_step_id: this.data.id,
            title: "система",
            comment: actionComment,
          },
        ];
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
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
        }
        this.data.newActionComments = [
          {
            timeline_step_id: this.data.id,
            title: "система",
            comment: actionComment,
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
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
        }
        this.data.newActionComments = [
          {
            timeline_step_id: this.data.id,
            title: "система",
            comment: actionComment,
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
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
        }
        this.data.newActionComments = [
          {
            timeline_step_id: this.data.id,
            title: "система",
            comment: actionComment,
          },
        ];
        this.data.date = this.callBackDate;
      }
      this.data.negative = 0;
      this.$emit("updateItem", this.data);
    },
  },
  emits: ["updateItem", "openRequestFormForUpdate"],
};
</script>

<style>
</style>