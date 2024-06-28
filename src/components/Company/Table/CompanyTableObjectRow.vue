<template>
    <tr class="table-object-row">
        <td></td>
        <td colspan="4">
            <CompanyTableObjectItem :object="object" class="col-12" />
        </td>
        <td>
            <div></div>
        </td>
        <td class="text-warning">
            <div>
                <span v-if="attention">Объект давно не обновляли!</span>
            </div>
        </td>
        <td>
            <div class="d-flex justify-content-center">
                <TableDateBlock :date="date" label="Обновление" />
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
