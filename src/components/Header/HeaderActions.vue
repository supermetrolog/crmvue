<template>
    <teleport to="body">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormCompanyDeal v-if="dealFormVisible" @close="clickCloseDealForm" />
        </transition>
    </teleport>
    <div class="row">
        <div class="col-md-4 col-8 ml-auto">
            <button @click="clickOpenDealForm" class="btn btn-primary btn-large">
                создать сделку
                <i class="ml-2 fa-solid fa-bolt"></i>
            </button>
        </div>
    </div>
</template>

<script>
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';

export default {
    name: 'HeaderActions',
    components: {
        FormCompanyDeal
    },
    data() {
        return {
            dealFormVisible: false
        };
    },
    methods: {
        clickOpenDealForm() {
            this.dealFormVisible = true;
        },
        clickCloseDealForm() {
            this.dealFormVisible = false;
        }
    }
};
</script>

<style></style>