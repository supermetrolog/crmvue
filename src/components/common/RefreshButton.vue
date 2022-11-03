<template>
  <button class="btn btn-success_alt btn-refresh" title="Обновить">
    <i class="fas fa-sync-alt"></i>
  </button>
</template>

<script>
export default {
  name: "RefreshButton",
};
</script>

<style lang="scss" scoped>
.btn-refresh {
  padding: 6px 8px;
  i {
    font-size: 20px;
    color: yellow;
  }
}
</style>
