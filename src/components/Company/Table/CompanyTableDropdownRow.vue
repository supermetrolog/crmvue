<template>
    <tr class="dropdown-switcher-row">
        <td></td>
        <td :colspan="colspan">
            <div class="company-table-item__actions">
                <slot />
            </div>
        </td>
        <td v-for="key in 7 - colspan" :key="key"></td>
    </tr>
</template>

<script setup>
defineProps({ colspan: { type: Number, default: 1 } });
</script>
