<template>
    <div class="caller-manager__contact">
        <teleport to="body">
            <FormCompany
                v-if="companyFormVisible"
                @close="companyFormVisible = false"
                @created="createdCompany"
            />
            <FormCompanyRequest
                v-if="requestFormVisible"
                @close="requestFormVisible = false"
                :company-id="createdCompanyId"
            />
            <FormCompanyContact
                v-if="contactFormVisible"
                @close="contactFormVisible = false"
                :company_id="createdCompanyId"
            />
        </teleport>
        <div class="row no-gutters caller-manager__contact__container">
            <div class="col-12 text-center">
                <b>НЕИЗВЕСТНЫЙ КОНТАКТ</b>
            </div>
            <div class="col-12 text-center mt-3">
                <button @click="companyFormVisible = true" class="btn btn-primary">
                    Создать компанию
                </button>
            </div>
            <div class="col-12 text-center mt-3">
                <button @click="contactFormVisible = true" class="btn btn-primary">
                    Создать контакт
                </button>
            </div>
            <div class="col-12 text-center mt-3">
                <button @click="requestFormVisible = true" class="btn btn-primary">
                    Создать запрос
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import FormCompany from '@/components/Forms/Company/FormCompany.vue';
import FormCompanyRequest from '@/components/Forms/Company/FormCompanyRequest.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';

export default {
    name: 'CallerManagerNotExistContact',
    components: {
        FormCompanyContact,
        FormCompanyRequest,
        FormCompany
    },
    data() {
        return {
            companyFormVisible: false,
            requestFormVisible: false,
            contactFormVisible: false,
            createdCompanyId: null
        };
    },

    methods: {
        clickCloseCompanyForm() {
            this.companyFormVisible = false;
        },
        createdCompany(company_id) {
            this.createdCompanyId = company_id;
        }
    }
};
</script>

<style></style>
