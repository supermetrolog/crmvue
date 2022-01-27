<template>
  <div class="row item no-gutters">
    <div class="col-2 avatar text-center">
      <i class="fas fa-phone-alt" :class="[status.iconClass, status.icon]"></i>
    </div>
    <div class="col-10 message text-left">
      <p class="title">
        Звонок
        <small class="time">{{ call.created_at }}</small>
      </p>
      <p class="text" v-if="call.type == 0">
        Исходящий звонок на номер
        <PhoneNumber
          v-if="call.phoneTo"
          :phone="{ phone: call.to }"
          :text="`${call.to} (${call.phoneTo.contact.first_name} ${call.phoneTo.contact.middle_name})`"
          :contact="call.phoneTo.contact"
          class="d-inline"
          classList="text-center d-inline"
          @createdContact="$emit('refreshCallList')"
        />
        <!-- <span v-else>{{ call.to }}(нет в базе)</span> -->
        <PhoneNumber
          v-else
          :phone="{ phone: call.to }"
          :text="`${call.to} (нет в базе)`"
          class="d-inline"
          classList="text-center d-inline"
          @createdContact="$emit('refreshCallList')"
        />
      </p>
      <p class="text" v-else-if="call.type == 1">
        Входящий звонок с номера
        <PhoneNumber
          v-if="call.phoneFrom"
          :phone="{ phone: call.from }"
          :text="`${call.from} (${call.phoneFrom.contact.first_name} ${call.phoneFrom.contact.middle_name})`"
          :contact="call.phoneFrom.contact"
          class="d-inline"
          classList="text-center d-inline"
          @createdContact="$emit('refreshCallList')"
        />
        <PhoneNumber
          v-else
          :phone="{ phone: call.from }"
          :text="`${call.from} (нет в базе)`"
          class="d-inline"
          classList="text-center d-inline"
          @createdContact="$emit('refreshCallList')"
        />
        <!-- <span v-else>{{ call.from }}(нет в базе)</span> -->
      </p>
      <div class="call-status">
        <p class="text">Статус:</p>
        <p class="text ml-1" :class="status.class">
          {{ status.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CallItem",
  props: {
    call: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["THIS_USER"]),
    status() {
      let status = {};
      status.icon = "fas fa-reply";
      status.iconClass = "text-success";

      if (this.call.type == 0) {
        status.iconClass = "text-success_alt";

        status.icon = "fas fa-share";
      }
      switch (this.call.status) {
        case "ANSWER":
          status.class = "text-success";
          status.text = "вызов принят";
          // status.icon = "fas fa-phone-volume";
          break;
        case "BUSY":
          status.class = "text-danger";
          status.text = "вызов сброшен";
          break;
        case "CANCEL":
          status.class = "text-warning";
          status.text = "вызов отменен";
          break;
        case "NOANSWER":
          status.class = "text-warning";
          status.text = "абонент не ответил";
          break;
        case null:
          status.class = "text-info";
          status.text = "ожидание ответа";
          // status.icon = "fas fa-phone-alt";
          break;
        default:
          break;
      }
      return status;
    },
  },
};
</script>

<style>
</style>