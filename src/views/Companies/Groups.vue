<template>
    <section class="company-groups">
        <FormCompanyGroup
            v-if="companyGroupFormIsVisible"
            @close="closeCompanyGroupForm"
            @created="fetchCompanyGroups"
            @updated="fetchCompanyGroups"
            :form-data="editingGroup"
        />
        <div class="row">
            <div class="col-12">
                <Button @click="companyGroupFormIsVisible = true" success>
                    Создать группу компаний
                </Button>
                <div class="box mt-2">
                    <Spinner v-if="isLoading" />
                    <CompanyGroupsTable
                        v-else-if="COMPANY_GROUPS.length"
                        @edit="updateGroup"
                        @deleted="fetchCompanyGroups"
                        :company-groups="COMPANY_GROUPS"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import CompanyGroupsTable from '@/components/Company/CompanyGroupsTable.vue';
import FormCompanyGroup from '@/components/Forms/Company/FormCompanyGroup.vue';
import Button from '@/components/common/Button.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { computed, onMounted, ref } from 'vue';
import Spinner from '@/components/common/Spinner.vue';

const store = useStore();

const { isLoading } = useDelayedLoader();
const companyGroupFormIsVisible = ref(false);
const editingGroup = ref(null);

const COMPANY_GROUPS = computed(() => store.getters.COMPANY_GROUPS);

const fetchCompanyGroups = async () => {
    isLoading.value = true;
    await store.dispatch('FETCH_COMPANY_GROUP_LIST');
    isLoading.value = false;
};
const updateGroup = group => {
    editingGroup.value = group;
    companyGroupFormIsVisible.value = true;
};
const closeCompanyGroupForm = () => {
    companyGroupFormIsVisible.value = false;
    editingGroup.value = null;
};

onMounted(() => {
    fetchCompanyGroups();
});
</script>
