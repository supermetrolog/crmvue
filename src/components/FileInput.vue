<template>
  <div class="custom-file-input">
    <button @click.prevent="clickOpenFile()" class="btn btn-file btn-large">
      Открыть
    </button>
    <input
      type="file"
      class="d-none"
      ref="fileInput"
      multiple
      @change="this.$emit('change')"
    />
  </div>
</template>

<script>
export default {
  name: "FileInput",
  methods: {
    clickOpenFile() {
      this.$refs.fileInput.click();
    },
  },
};
</script>

<style>
</style>