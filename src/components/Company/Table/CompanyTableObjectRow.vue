<template>
    <tr class="table-object-row">
        <td></td>
        <td colspan="5">
            <CompanyTableObjectItem :object="object" class="col-12" />
        </td>
        <td>
            <div class="d-flex justify-content-center">
                <TableDateBlock :date="date" label="Дата обновления" />
            </div>
        </td>
    </tr>
</template>

<script setup>
import CompanyTableObjectItem from '@/components/Company/Table/CompanyTableObjectItem.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import { computed } from 'vue';

const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    attention: {
        type: Boolean,
        default: false
    }
});

const date = computed(() => props.object.last_update * 1000);
</script>
