<template>
    <tr class="DropdownSwitcherRow">
        <td></td>
        <td :colspan="colspan">
            <div class="company-table-item__actions">
                <slot />
            </div>
        </td>
        <td class="CompanyTableItem-notif"></td>
        <td></td>
    </tr>
</template>

<script>
export default {
    name: 'CompanyTableDropdownRow',
    props: {
        colspan: {
            type: Number,
            default: 1
        }
    }
};
</script>