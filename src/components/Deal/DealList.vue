<template>
    <div class="deal-list">
        <hr />
        <template v-if="deals.length">
            <h4 class="text-center">Сделки без запроса - {{ deals.length }}</h4>
            <div class="deal-list__vertical mt-1">
                <DealListItem
                    v-for="deal in deals"
                    :key="deal.id"
                    @update="updateDeal(deal)"
                    @delete="deleteDeal(deal)"
                    class="mb-2 mt-1"
                    :deal="deal"
                />
            </div>
        </template>
    </div>
</template>

<script setup>
import DealListItem from '@/components/Deal/DealListItem.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { shallowRef } from 'vue';
import api from '@/api/api.js';

const emit = defineEmits(['update', 'deleted']);
defineProps({
    deals: {
        type: Array,
        default: () => []
    }
});

const { confirm } = useConfirm();
const isLoading = shallowRef(false);
const deleteDeal = async deal => {
    const confirmed = await confirm('Удалить сделку', 'Вы уверены, что хотите удалить сделку?');
    if (!confirmed) return;

    isLoading.value = true;
    const deleted = await api.deal.delete(deal.id, deal);
    isLoading.value = false;

    if (deleted) emit('deleted');
};

const updateDeal = deal => {
    emit('update', deal);
};
</script>
