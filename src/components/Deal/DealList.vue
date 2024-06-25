<template>
    <div class="deal-list">
        <hr />
        <div v-if="deals.length" class="row mb-2">
            <div class="col-12 text-center">
                <p>Сделки без запроса - {{ deals.length }}</p>
            </div>
        </div>
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

<script>
import { mapActions } from 'vuex';
import DealListItem from '@/components/Deal/DealListItem.vue';
import { useConfirm } from '@/composables/useConfirm.js';

export default {
    name: 'DealList',
    components: {
        DealListItem
    },
    emits: ['update', 'deleted'],
    props: {
        deals: {
            type: Array,
            default: () => []
        }
    },
    setup() {
        const { confirm } = useConfirm();
        return { confirm };
    },
    data() {
        return {
            isLoading: false
        };
    },
    methods: {
        ...mapActions(['DELETE_DEAL']),
        async deleteDeal(deal) {
            const confirmed = confirm('Вы уверены, что хотите удалить сделку?');
            if (!confirmed) return;

            this.isLoading = true;
            await this.DELETE_DEAL(deal);
            this.isLoading = false;

            this.$emit('deleted');
        },
        updateDeal(deal) {
            this.$emit('update', deal);
        }
    }
};
</script>
