<template>
    <div class="company-groups">
        <FormCompanyGroup
            @closeCompanyGroupsForm="clickCloseCompanyGroupsForm"
            v-if="companyGroupsFormVisible"
            :formdata="companyGroupsForUpdate"
            @created="getCompanyGroups"
            @updated="getCompanyGroups"
        />
        <div class="row no-gutters box mt-2">
            <div class="col-12">
                <button
                    class="btn btn-primary scale"
                    @click="clickOpenCompanyGroupsForm"
                >
                    Создать группу компаний
                </button>
            </div>
            <div class="col-12 inner inner-default-size mt-2">
                <Loader v-if="loader" class="center"/>
                <CompanyGroupsTable
                    @clickEdit="clickOpenCompanyGroupsFormForUpdate"
                    @deleted="getCompanyGroups"
                    :companyGroups="COMPANY_GROUPS"
                    v-if="COMPANY_GROUPS.length"
                />
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Loader from "@/components/common/Loader.vue";
import CompanyGroupsTable from "@/components/Company/CompanyGroupsTable.vue";
import FormCompanyGroup from "@/components/forms/templates/Company/FormCompanyGroup.vue";

export default {
    name: "CompanyGroups",
    components: {
        FormCompanyGroup,
        CompanyGroupsTable,
        Loader
    },
    data() {
        return {
            loader: false,
            companyGroupsFormVisible: false,
            companyGroupsForUpdate: null,
        };
    },
    computed: {
        ...mapGetters(["COMPANY_GROUPS"]),
    },
    methods: {
        ...mapActions(["FETCH_COMPANY_GROUP_LIST"]),

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
        },
    },
    mounted() {
        this.getCompanyGroups();
    },
};
</script>

<style>
</style>