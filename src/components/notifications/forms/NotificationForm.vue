<template>
  <div class="notification-form">
    <Modal title="Создание уведомления" @close="closeForm">
      <h1>Notify Form</h1>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "NotificationForm",
  methods: {
    closeForm() {
      this.$emit("close");
    },
  },
};
</script>

<style>
</style>