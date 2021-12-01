<template>
  <div class="row item no-gutters">
    <div class="col-2 avatar text-center">
      <i class="fas fa-phone-alt" :class="{ 'text-success': !call.status }"></i>
    </div>
    <div class="col-10 message text-left">
      <p class="title">
        Звонок
        <small class="time">{{ call.created_at }}</small>
      </p>
      <p class="text" v-if="call.from == THIS_USER.userProfile.caller_id">
        Исходящий звонок на номер {{ call.to }}
      </p>
      <p class="text" v-else>Входящий звонок с номера {{ call.to }}</p>
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
  },
};
</script>

<style>
</style>