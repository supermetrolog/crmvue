<template>
    <teleport to="body">
        <FormCompanyDeal v-if="dealFormVisible" @close="clickCloseDealForm" />
    </teleport>
    <div class="header__actions">
        <Button @click="clickOpenDealForm" small icon>
            создать сделку
            <i class="ml-2 fa-solid fa-bolt"></i>
        </Button>
    </div>
</template>

<script>
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import Button from '@/components/common/Button.vue';

export default {
    name: 'HeaderActions',
    components: {
        Button,
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
