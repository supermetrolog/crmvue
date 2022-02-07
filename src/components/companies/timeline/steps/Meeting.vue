<template>
  <div class="col-12" v-if="data">
    <div class="row no-gutters" v-if="data.additional != 1">
      <div class="col-4 pr-1">
        <CustomButton
          :options="{ btnActive: data.additional == 1, disabled }"
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
            disabled,
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
          :options="{ btnActive: data.negative, btnClass: 'danger', disabled }"
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
        <CustomButton
          :options="{
            btnActive: data.done,
            btnClass: 'success',
            btnVisible: false,
            disabled,
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
        <CustomButton
          :options="{
            btnActive: true,
            btnClass: 'dark',
            btnVisible: false,
            disabled,
          }"
          @confirm="$emit('openRequestFormForUpdate')"
        >
          <template #btnContent>
            <i class="fas fa-pencil-alt"></i>
            Редактировать запрос
          </template>
        </CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/CustomButton.vue";
import { MixinSteps } from "../mixins";
export default {
  name: "Meeting",
  mixins: [MixinSteps],
  components: {
    CustomButton,
  },
  data() {
    return {
      callBackDate: null,
    };
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
    selectDone(comment) {
      if (this.data.done) {
        this.data.done = 0;
        this.data.newActionComments = [];
        this.data.status = 0;
      } else {
        this.data.done = 1;
        let actionComment = "Утвердил запрос";
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
        }
        this.data.newActionComments = [
          {
            timeline_id: this.data.timeline_id,
            timeline_step_id: this.data.id,
            timeline_step_number: this.data.number,
            title: "система",
            comment: actionComment,
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
        if (comment) {
          actionComment += ` с комментарием: "${comment}"`;
        }
        this.data.newActionComments = [
          {
            timeline_id: this.data.timeline_id,
            timeline_step_id: this.data.id,
            timeline_step_number: this.data.number,
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
            timeline_id: this.data.timeline_id,
            timeline_step_id: this.data.id,
            timeline_step_number: this.data.number,
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
            timeline_id: this.data.timeline_id,
            timeline_step_id: this.data.id,
            timeline_step_number: this.data.number,
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
  watch: {
    step() {
      this.setData();
    },
  },
  emits: ["updateItem", "openRequestFormForUpdate"],
};
</script>

<style>
</style>