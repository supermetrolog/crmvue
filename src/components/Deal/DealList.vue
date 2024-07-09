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
import { useStore } from 'vuex';
import DealListItem from '@/components/Deal/DealListItem.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { shallowRef } from 'vue';

const emit = defineEmits(['update', 'deleted']);
defineProps({
    deals: {
        type: Array,
        default: () => []
    }
});

const store = useStore();
const { confirm } = useConfirm();
const isLoading = shallowRef(false);
const deleteDeal = async deal => {
    const confirmed = await confirm('Вы уверены, что хотите удалить сделку?');
    if (!confirmed) return;

    isLoading.value = true;
    await store.dispatch('DELETE_DEAL', deal);
    isLoading.value = false;

    emit('deleted');
};

const updateDeal = deal => {
    emit('update', deal);
};
</script>
