<template>
  <div class="row item">
    <div class="row item no-gutters">
      <div class="col-2 avatar text-center">
        <i class="fas fa-phone-alt"></i>
      </div>
      <div class="col-10 message text-left">
        <p class="title">
          {{ call.from }}
          <small class="time">{{ call.created_at }}</small>
        </p>
        <p class="text">{{ call.to }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CallItem",
  props: {
    call: {
      type: Object,
    },
  },
};
</script>

<style>
</style>