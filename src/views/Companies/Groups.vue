<template>
    <section class="company-groups">
        <teleport to="body">
            <FormCompanyGroup
                v-if="companyGroupFormIsVisible"
                @close="closeCompanyGroupForm"
                @created="fetchCompanyGroups"
                @updated="fetchCompanyGroups"
                :form-data="editingGroup"
            />
        </teleport>
        <div class="row">
            <UiCol :cols="12">
                <div class="d-flex justify-content-end">
                    <UiButton
                        @click="companyGroupFormIsVisible = true"
                        color="success-light"
                        icon="fa-solid fa-plus"
                    >
                        Создать группу компаний
                    </UiButton>
                </div>
            </UiCol>
            <div class="col-12">
                <Spinner v-if="isLoading" />
                <CompanyGroupsTable
                    v-else-if="COMPANY_GROUPS.length"
                    @edit="updateGroup"
                    @deleted="fetchCompanyGroups"
                    :company-groups="COMPANY_GROUPS"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import CompanyGroupsTable from '@/components/Company/CompanyGroupsTable.vue';
import FormCompanyGroup from '@/components/Forms/Company/FormCompanyGroup.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { computed, onMounted, ref, shallowRef } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const store = useStore();

const { isLoading } = useDelayedLoader();

const companyGroupFormIsVisible = ref(false);
const editingGroup = shallowRef(null);

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

onMounted(fetchCompanyGroups);
</script>
