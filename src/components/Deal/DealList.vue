<template>
    <div class="deal-list">
        <Modal v-if="deletedDealItem" @close="clickCloseModal" title="Удаление сделки " class="action-modal autosize">
            <div class="row no-gutters">
                <div class="col-12 text-center">
                    <h4 class="text-dark">Вы уверены что хотите удалить сделку?</h4>
                    <DealListItem :deal="deletedDealItem" :reed-only="true" />
                </div>
                <div class="col-12 mt-4 text-center">
                    <Loader v-if="deleteLoader" class="center small" />
                    <button @click="deleteDeal(deletedDealItem)" class="btn btn-danger" :disabled="deleteLoader">
                        Удалить
                    </button>
                    <button @click="clickCloseModal" class="btn btn-primary ml-1" :disabled="deleteLoader">Нет</button>
                </div>
            </div>
        </Modal>
        <hr />
        <div v-if="deals.length" class="row mb-2">
            <div class="col-12 text-center">
                <p>Сделки без запроса - {{ deals.length }}</p>
            </div>
        </div>
        <DealListItem
            v-for="deal in deals"
            :key="deal.id"
            @openDealFormForUpdate="openDealFormForUpdate"
            @deleteDeal="clickDeleteDeal"
            class="mb-2 mt-1"
            :deal="deal"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import Modal from '@/components/common/Modal.vue';
import DealListItem from '@/components/Deal/DealListItem.vue';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'DealList',
    components: {
        Loader,
        DealListItem,
        Modal
    },
    props: {
        deals: {
            type: Array
        }
    },
    data() {
        return {
            deletedDealItem: null,
            deleteLoader: false
        };
    },
    methods: {
        ...mapActions(['DELETE_DEAL']),
        openDealFormForUpdate(deal) {
            this.$emit('openDealFormForUpdate', deal);
        },
        clickCloseModal() {
            this.deletedDealItem = null;
        },
        clickDeleteDeal(deal) {
            this.deletedDealItem = deal;
        },
        async deleteDeal(deal) {
            this.deleteLoader = true;
            await this.DELETE_DEAL(deal);
            this.deleteLoader = false;
            this.deletedDealItem = null;
            this.$emit('deleted');
        }
    }
};
</script>

<style></style>