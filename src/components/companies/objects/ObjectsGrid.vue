<template>
  <div class="row no-gutters">
    <div class="col text-right">
      <button class="btn btn-success" @click="clickConfirm">Сохранить</button>
      <button class="btn btn-danger ml-2" @click="clickCancel">Закрыть</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObjectsGrid",
  methods: {
    clickConfirm() {
      this.$emit("close");
    },
    clickCancel() {
      this.$emit("close");
    },
  },
  emits: ["close"],
};
</script>

<style>
</style>