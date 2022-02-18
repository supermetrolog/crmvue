<template>
  <div class="table">
    <table>
      <thead>
        <slot name="thead" />
      </thead>
      <tbody>
        <slot name="tbody" />
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Table",
};
</script>

<style>
</style>