<template>
    <div class="phone-number fuck">
        <FormCompanyContact
            v-if="companyContactFormVisible"
            @closeCompanyForm="clickCloseCompanyContactForm"
            @updated="refreshContacts"
            @created="$emit('createdContact')"
            :formdata="contactForUpdate"
            :phones="[
                {
                    phone: phone.phone,
                    exten: null
                }
            ]"
        />
        <teleport to="body">
            <Modal v-if="modalVisible" @close="clickCloseModal" title="Контакт" width="500">
                <div class="modal-content">
                    <Loader v-if="loader" class="center" />
                    <div class="row">
                        <div v-if="company" class="col-6 box">
                            <router-link
                                :to="'/companies/' + company.id"
                                target="_blank"
                                class="mb-2 text-center title text-primary d-block"
                            >
                                Компания #{{ company.id }}
                            </router-link>

                            <div class="inner">
                                <!-- <p>{{ company.nameRu }} - {{ company.nameEng }}</p> -->
                                <Company :company="company" />
                            </div>
                        </div>
                        <div
                            v-if="contact"
                            class="col-6 text-center box"
                            :class="{ 'col-12': !company }"
                        >
                            <h4 class="mb-2">Контакт</h4>
                            <div
                                v-if="currentContactForCall"
                                class="current-phone inner text-light"
                            >
                                <CompanyContactList
                                    @createComment="refreshContacts"
                                    @deleteContact="refreshContacts"
                                    @openContactFormForUpdate="openContactFormForUpdate"
                                    :contacts="currentContactForCall"
                                />
                                <p class="mb-1 text-light">
                                    {{ phone.phone }}{{ phone.exten ? ` => ${phone.exten}` : '' }}
                                </p>
                                <button class="btn btn-primary scale">
                                    <i class="fas fa-phone-volume mr-1"></i> позвонить
                                </button>
                            </div>
                            <h4 class="mb-2 mt-2">Все контакты</h4>
                            <div class="inner">
                                <CompanyContactList
                                    @createComment="refreshContacts"
                                    @deleteContact="refreshContacts"
                                    @openContactFormForUpdate="openContactFormForUpdate"
                                    :contacts="companyContacts"
                                />
                            </div>
                        </div>
                        <div v-else class="col-12 text-center box">
                            <h4 class="mb-2">Нет в базе</h4>
                            <div class="current-phone inner text-light">
                                <p class="mb-1 text-light">{{ phone.phone }}</p>
                                <button class="btn btn-primary scale btn-large">
                                    <i class="fas fa-phone-volume mr-1"></i> позвонить
                                </button>
                                <button
                                    @click="clickOpenCompanyContactForm"
                                    class="btn btn-primary scale btn-large d-block mx-auto mt-2"
                                >
                                    создать контакт
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </teleport>
        <a @click.prevent="clickLink" :class="classList" :href="'tel:' + phone.phone">{{
            phoneText
        }}</a>
    </div>
</template>

<script>
import api from '@/api/api';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import CompanyContactList from '@/components/Company/Contact/CompanyContactList.vue';
import Company from '@/components/Company/Company.vue';

export default {
    name: 'PhoneNumber',
    components: {
        CompanyContactList,
        Modal,
        Loader,
        FormCompanyContact,
        Company
    },
    emits: ['createdContact'],
    props: {
        phone: {
            type: Object,
            default: null
        },
        text: {
            type: String,
            default: null
        },
        contact: {
            type: Object,
            default: null
        },
        classList: {
            type: String,
            default: 'text-center'
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            modalVisible: false,
            company: null,
            companyContacts: null,
            loader: false,
            contactForUpdate: null,
            companyContactFormVisible: false
        };
    },
    computed: {
        currentContactForCall() {
            if (!this.companyContacts) {
                return false;
            }
            let currentContact = false;
            this.companyContacts.forEach(item => {
                if (item.id == this.contact.id) {
                    currentContact = item;
                }
            });
            return [currentContact];
        },
        phoneText() {
            if (this.text) {
                return this.text;
            }
            let name = this.phone.phone;
            if (this.phone.exten) {
                name += ' => ' + this.phone.exten;
            }
            return name;
        }
    },
    methods: {
        async clickLink() {
            this.modalVisible = true;
            if (this.contact) {
                this.loader = true;
                const company = await api.companies.getCompany(this.contact.company_id);
                this.company = company[0];
                this.companyContacts = await api.contacts.getContacts(this.contact.company_id);
                this.loader = false;
            }
        },
        async refreshContacts() {
            this.companyContacts = await api.contacts.getContacts(this.contact.company_id);
        },
        clickCloseModal() {
            this.modalVisible = false;
        },
        openContactFormForUpdate(contact) {
            this.contactForUpdate = contact;
            this.clickOpenCompanyContactForm();
        },
        clickCloseCompanyContactForm() {
            this.companyContactFormVisible = false;
            this.contactForUpdate = null;
        },
        clickOpenCompanyContactForm() {
            this.companyContactFormVisible = true;
        }
    }
};
</script>
