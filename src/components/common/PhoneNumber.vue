<template>
    <div class="phone-number fuck">
        <FormCompanyContact
            @closeCompanyForm="clickCloseCompanyContactForm"
            :formdata="contactForUpdate"
            :phones="[
        {
          phone: this.phone.phone,
          exten: null,
        },
      ]"
            @updated="refreshContacts"
            @created="$emit('createdContact')"
            v-if="companyContactFormVisible"
        />
        <Modal
            v-if="modalVisible"
            @close="clickCloseModal"
            title="Контакт"
            class="z-index text-left"
        >
            <div class="modal-content">
                <Loader v-if="loader" class="center"/>
                <div class="row">
                    <div class="col-6 box" v-if="company">
                        <router-link
                            :to="'/companies/' + company.id"
                            target="_blank"
                            class="mb-2 text-center title text-primary d-block"
                        >
                            Компания #{{ company.id }}
                        </router-link>

                        <div class="inner">
                            <!-- <p>{{ company.nameRu }} - {{ company.nameEng }}</p> -->
                            <Company :company="company"/>
                        </div>
                    </div>
                    <div
                        class="col-6 text-center box"
                        v-if="contact"
                        :class="{ 'col-12': !company }"
                    >
                        <h4 class="mb-2">Контакт</h4>
                        <div
                            class="current-phone inner text-light"
                            v-if="currentContactForCall"
                        >
                            <CompanyContactList
                                :contacts="currentContactForCall"
                                @createComment="refreshContacts"
                                @deleteContact="refreshContacts"
                                @openContactFormForUpdate="openContactFormForUpdate"
                            />
                            <p class="mb-1 text-light">
                                {{ phone.phone }}{{ phone.exten ? ` => ${phone.exten}` : "" }}
                            </p>
                            <button class="btn btn-primary scale">
                                <i class="fas fa-phone-volume mr-1"></i> позвонить
                            </button>
                        </div>
                        <h4 class="mb-2 mt-2">Все контакты</h4>
                        <div class="inner">
                            <CompanyContactList
                                :contacts="companyContacts"
                                @createComment="refreshContacts"
                                @deleteContact="refreshContacts"
                                @openContactFormForUpdate="openContactFormForUpdate"
                            />
                        </div>
                    </div>
                    <div class="col-12 text-center box" v-else>
                        <h4 class="mb-2">Нет в базе</h4>
                        <div class="current-phone inner text-light">
                            <p class="mb-1 text-light">{{ phone.phone }}</p>
                            <button class="btn btn-primary scale btn-large">
                                <i class="fas fa-phone-volume mr-1"></i> позвонить
                            </button>
                            <button
                                class="btn btn-primary scale btn-large d-block mx-auto mt-2"
                                @click="clickOpenCompanyContactForm"
                            >
                                создать контакт
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
        <a
            :class="classList"
            :href="'tel:' + phone.phone"
            @click.prevent="clickLink"
        >{{ phoneText }}</a
        >
    </div>
</template>

<script>
import api from "@/api/api";
import Loader from "@/components/common/Loader.vue";
import Modal from "@/components/common/Modal.vue";
import FormCompanyContact from "@/components/forms/templates/Company/FormCompanyContact.vue";
import CompanyContactList from "@/components/Company/Contact/CompanyContactList.vue";
import Company from "@/components/Company/Company.vue";

export default {
    name: "PhoneNumber",
    components: {
        CompanyContactList,
        Modal,
        Loader,
        FormCompanyContact,
        Company
    },
    data() {
        return {
            modalVisible: false,
            company: null,
            companyContacts: null,
            loader: false,
            contactForUpdate: null,
            companyContactFormVisible: false,
        };
    },
    props: {
        phone: {
            type: Object,
            default: null,
        },
        text: {
            type: String,
            default: null,
        },
        contact: {
            type: Object,
            default: null,
        },
        classList: {
            type: String,
            default: "text-center",
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        currentContactForCall() {
            if (!this.companyContacts) {
                return false;
            }
            let currentContact = false;
            this.companyContacts.forEach((item) => {
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
                name += " => " + this.phone.exten;
            }
            return name;
        },
    },
    methods: {
        async clickLink() {
            this.modalVisible = true;
            if (this.contact) {
                this.loader = true;
                const company = await api.companies.getCompany(this.contact.company_id);
                this.company = company[0];
                this.companyContacts = await api.contacts.getContacts(
                    this.contact.company_id
                );
                this.loader = false;
            }
        },
        async refreshContacts() {
            this.companyContacts = await api.contacts.getContacts(
                this.contact.company_id
            );
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
        },
    },
};
</script>