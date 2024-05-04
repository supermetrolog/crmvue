<template>
    <div class="account-consultants">
        <p class="account-view__title">Список сотрудников компании</p>
        <div v-if="isLoading" class="row">
            <div v-for="i in 10" :key="i" class="col-12 col-xl-6">
                <AccountConsultantSkeleton v-for="i in 10" :key="i" />
            </div>
        </div>
        <div v-else class="row">
            <div v-for="user in consultants" :key="user.id" class="col-12 col-xl-6">
                <AccountConsultant :user="user" />
            </div>
        </div>
    </div>
</template>
<script>
import { LoaderMixin } from '@/components/Messenger/loader.mixin';
import AccountConsultant from '@/components/Account/AccountConsultant.vue';
import AccountConsultantSkeleton from '@/components/Account/AccountConsultantSkeleton.vue';

export default {
    name: 'AccountConsultants',
    components: { AccountConsultantSkeleton, AccountConsultant },
    mixins: [LoaderMixin],
    data() {
        return {
            loading: false,
            consultants: []
        };
    },
    computed: {
        originalLoader() {
            return this.loading;
        }
    },
    async created() {
        this.loading = true;

        this.consultants = await this.$store.dispatch('getConsultants');

        this.loading = false;
    }
};
</script>
