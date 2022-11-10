<template>
  <tr class="DropdownSwitcherRow">
    <td></td>
    <td :colspan="colspan">
      <div class="CompanyTableItem-block-actions">
        <slot />
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  name: "DropdownSwitcherRow",
  props: {
    colspan: {
      type: Number,
      default: 1,
    },
  },
};
</script>