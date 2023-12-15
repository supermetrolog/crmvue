<template>
    <div class="caller-manager__contact">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormCompany
                v-if="companyFormVisible"
                @closeCompanyForm="companyFormVisible = false"
                @created="createdCompany"
            />
        </transition>
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormCompanyRequest
                v-if="requestFormVisible"
                @closeCompanyForm="requestFormVisible = false"
                :company_id="createdCompanyId"
            />
        </transition>
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <FormCompanyContact
                v-if="contactFormVisible"
                @closeCompanyForm="contactFormVisible = false"
                :company_id="createdCompanyId"
            />
        </transition>
        <div class="row no-gutters caller-manager__contact__container">
            <div class="col-12 text-center">
                <b>НЕИЗВЕСТНЫЙ КОНТАКТ</b>
            </div>
            <div class="col-12 text-center mt-3">
                <button @click="companyFormVisible = true" class="btn btn-primary">Создать компанию</button>
            </div>
            <div class="col-12 text-center mt-3">
                <button @click="contactFormVisible = true" class="btn btn-primary">Создать контакт</button>
            </div>
            <div class="col-12 text-center mt-3">
                <button @click="requestFormVisible = true" class="btn btn-primary">Создать запрос</button>
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
