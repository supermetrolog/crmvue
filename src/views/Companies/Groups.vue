<template>
    <section class="company-groups">
        <FormCompanyGroup
            v-if="companyGroupsFormVisible"
            @closeCompanyGroupsForm="clickCloseCompanyGroupsForm"
            @created="getCompanyGroups"
            @updated="getCompanyGroups"
            :formdata="companyGroupsForUpdate"
        />
        <div class="row">
            <div class="col-12">
                <Button @click="clickOpenCompanyGroupsForm">Создать группу компаний</Button>
                <div class="box mt-2">
                    <Loader v-if="loader" />
                    <CompanyGroupsTable
                        v-if="COMPANY_GROUPS.length"
                        @clickEdit="clickOpenCompanyGroupsFormForUpdate"
                        @deleted="getCompanyGroups"
                        :company-groups="COMPANY_GROUPS"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loader from '@/components/common/Loader.vue';
import CompanyGroupsTable from '@/components/Company/CompanyGroupsTable.vue';
import FormCompanyGroup from '@/components/Forms/Company/FormCompanyGroup.vue';
import Button from '@/components/common/Button.vue';

export default {
    name: 'CompanyGroups',
    components: {
        Button,
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
