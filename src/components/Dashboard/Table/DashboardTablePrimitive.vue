<template>
    <div class="dashboard-table-primitive">
        <table class="dashboard-table-primitive__table">
            <thead class="dashboard-table-primitive__head">
                <tr>
                    <th v-for="column in columns" :key="column.key">
                        {{ column.label }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item.id">
                    <td
                        v-for="column in columns"
                        :key="column.key"
                        :style="{
                            width: column.width ?? 'auto'
                        }"
                    >
                        <slot :name="column.key" :item="item">
                            <span>{{ item[column.key] }}</span>
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'DashboardTablePrimitive',
    props: {
        columns: {
            type: Array,
            required: true
        },
        items: {
            type: Array,
            default: () => []
        }
    }
};
</script>
