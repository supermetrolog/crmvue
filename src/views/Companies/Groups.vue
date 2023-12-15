<template>
    <div class="company-groups">
        <FormCompanyGroup
            v-if="companyGroupsFormVisible"
            @closeCompanyGroupsForm="clickCloseCompanyGroupsForm"
            @created="getCompanyGroups"
            @updated="getCompanyGroups"
            :formdata="companyGroupsForUpdate"
        />
        <div class="row no-gutters box mt-2">
            <div class="col-12">
                <button @click="clickOpenCompanyGroupsForm" class="btn btn-primary scale">
                    Создать группу компаний
                </button>
            </div>
            <div class="col-12 inner inner-default-size mt-2">
                <Loader v-if="loader" class="center" />
                <CompanyGroupsTable
                    v-if="COMPANY_GROUPS.length"
                    @clickEdit="clickOpenCompanyGroupsFormForUpdate"
                    @deleted="getCompanyGroups"
                    :companyGroups="COMPANY_GROUPS"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import CompanyGroupsTable from '@/components/Company/CompanyGroupsTable.vue';
import FormCompanyGroup from '@/components/Forms/Company/FormCompanyGroup.vue';

export default {
    name: 'CompanyGroups',
    components: {
        FormCompanyGroup,
        CompanyGroupsTable,
        Loader
    },
    data() {
        return {
            loader: false,
            companyGroupsFormVisible: false,
            companyGroupsForUpdate: null
        };
    },
    computed: {
        ...mapGetters(['COMPANY_GROUPS'])
    },
    methods: {
        ...mapActions(['FETCH_COMPANY_GROUP_LIST']),

        clickOpenCompanyGroupsForm() {
            this.companyGroupsFormVisible = true;
        },
        clickCloseCompanyGroupsForm() {
            this.companyGroupsForUpdate = null;
            this.companyGroupsFormVisible = false;
        },
        clickOpenCompanyGroupsFormForUpdate(companyGroup) {
            this.companyGroupsForUpdate = companyGroup;
            this.companyGroupsFormVisible = true;
        },
        async getCompanyGroups() {
            this.loader = true;
            await this.FETCH_COMPANY_GROUP_LIST();
            this.loader = false;
        }
    },
    mounted() {
        this.getCompanyGroups();
    }
};
</script>

<style></style>