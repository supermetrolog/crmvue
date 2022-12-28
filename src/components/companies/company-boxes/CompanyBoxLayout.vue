<template>
  <div class="CompanyBoxLayout" :class="this.class">
    <div class="inner">
      <div class="CompanyBoxLayout-header">
        <slot name="header" />
      </div>
      <div class="CompanyBoxLayout-content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyBoxLayout",
  props: {
    class: {
      type: String,
    },
  },
};
</script>