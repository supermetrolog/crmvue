<template>
    <div class="account-consultants">
        <Teleport to="body">
            <FormUser v-if="editingUser" @close="editingUser = null" :form-data="editingUser" />
        </Teleport>
        <p class="account-view__title">Список сотрудников компании</p>
        <div v-if="isLoading" class="row">
            <div v-for="i in 10" :key="i" class="col-12 col-xl-6">
                <AccountConsultantSkeleton v-for="i in 10" :key="i" />
            </div>
        </div>
        <div v-else class="row">
            <div v-for="user in consultants" :key="user.id" class="col-12 col-xl-6">
                <AccountConsultant @edit="editUser(user)" :can-edit="userCanEdit" :user="user" />
            </div>
        </div>
    </div>
</template>
<script setup>
import AccountConsultant from '@/components/Account/AccountConsultant.vue';
import AccountConsultantSkeleton from '@/components/Account/AccountConsultantSkeleton.vue';
import { computed, ref } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useStore } from 'vuex';
import FormUser from '@/components/Forms/FormUser.vue';
import { userOptions } from '@/const/options/user.options.js';

const store = useStore();
const { isLoading } = useDelayedLoader();

const consultants = ref([]);
const editingUser = ref(null);

const userCanEdit = computed(
    () =>
        store.getters.THIS_USER.role === userOptions.roleStatement.ADMIN ||
        store.getters.THIS_USER.role === userOptions.roleStatement.DIRECTOR
);

const fetchConsultants = async () => {
    isLoading.value = true;
    consultants.value = await store.dispatch('getConsultants');
    isLoading.value = false;
};

const editUser = user => (editingUser.value = user);

fetchConsultants();
</script>
