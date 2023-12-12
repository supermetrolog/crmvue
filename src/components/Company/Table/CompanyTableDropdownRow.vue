<template>
    <tr class="DropdownSwitcherRow">
        <td></td>
        <td :colspan="colspan">
            <div class="CompanyTableItem-block-actions">
                <slot/>
            </div>
        </td>
        <td class="CompanyTableItem-notif"></td>
        <td></td>
    </tr>
</template>

<script>
export default {
    name: "CompanyTableDropdownRow",
    props: {
        colspan: {
            type: Number,
            default: 1,
        },
    },
};
</script>