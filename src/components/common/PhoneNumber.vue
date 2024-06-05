<template>
    <div class="phone-number">
        <teleport to="body">
            <Modal v-if="externalIsVisible" @close="closeExternal" title="Контакт" width="1200">
                <div v-if="isLoading" class="phone-number__loading">
                    <Spinner class="absolute-center" />
                </div>
                <div v-else class="row">
                    <div v-if="company" class="col-6">
                        <h3 class="text-center">Компания</h3>
                        <div class="inner-y">
                            <Company :company="company" class="mx-2" />
                        </div>
                    </div>
                    <div v-if="contact" class="col-6" :class="{ 'col-12': !company }">
                        <h3 class="mb-2 text-center">Контакт</h3>
                        <div v-if="currentContactForCall">
                            <CompanyContactList
                                @created-comment="refreshContacts"
                                @deleted="refreshContacts"
                                @start-editing="startEditing"
                                :contacts="currentContactForCall"
                                :read-only="readOnly"
                            />
                            <div class="mt-3">
                                <DashboardChip
                                    class="dashboard-bg-success-l phone-number__main mx-auto"
                                >
                                    {{ phone.phone }}{{ phone.exten ? ` => ${phone.exten}` : '' }}
                                </DashboardChip>
                                <Button icon success class="w-100 mt-1">
                                    <i class="fas fa-phone-volume" />
                                    <span>Позвонить</span>
                                </Button>
                            </div>
                        </div>
                        <h3 class="mb-1 mt-4 text-center">Все контакты</h3>
                        <CompanyContactList
                            @created-comment="refreshContacts"
                            @deleted="refreshContacts"
                            @start-editing="startEditing"
                            :contacts="companyContacts"
                            :read-only="readOnly"
                            class="inner-y phone-number__contacts"
                        />
                    </div>
                    <div v-else class="offset-3 col-6">
                        <DashboardCard>
                            <DashboardChip
                                class="dashboard-bg-danger-l phone-number__main w-100 text-center mb-4"
                            >
                                Нет в базе
                            </DashboardChip>
                            <DashboardChip
                                class="dashboard-bg-success-l phone-number__main mx-auto mb-2"
                            >
                                {{ phone.phone }}{{ phone.exten ? ` => ${phone.exten}` : '' }}
                            </DashboardChip>
                            <Button icon success class="mb-2 w-100">
                                <span>Позвонить</span>
                                <i class="fas fa-phone-volume mr-1"></i>
                            </Button>
                            <Button @click="companyContactFormIsVisible = true" class="w-100">
                                Создать контакт
                            </Button>
                        </DashboardCard>
                    </div>
                </div>
            </Modal>
            <FormCompanyContact
                v-if="companyContactFormIsVisible"
                @closeCompanyForm="cancelEditing"
                @updated="refreshContacts"
                @created="$emit('created-contact')"
                :formdata="editableContact"
                :phones="[
                    {
                        phone: phone.phone,
                        exten: null
                    }
                ]"
            />
        </teleport>
        <a @click.prevent="openExternal" :class="classList" :href="'tel:' + phone.phone">
            {{ phoneText }}
        </a>
    </div>
</template>

<script>
import api from '@/api/api';
import Modal from '@/components/common/Modal.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import CompanyContactList from '@/components/Company/Contact/CompanyContactList.vue';
import Company from '@/components/Company/Company.vue';
import Spinner from '@/components/common/Spinner.vue';
import Button from '@/components/common/Button.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';

export default {
    name: 'PhoneNumber',
    components: {
        DashboardCard,
        DashboardChip,
        Button,
        Spinner,
        CompanyContactList,
        Modal,
        FormCompanyContact,
        Company
    },
    emits: ['created-contact'],
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
    setup() {
        const { isLoading } = useDelayedLoader();
        return { isLoading };
    },
    data() {
        return {
            company: null,
            companyContacts: [],
            companyContactFormIsVisible: false,
            externalIsVisible: false,
            editableContact: null
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
            if (this.text) return this.text;
            let name = this.phone.phone;
            if (this.phone.exten) name += ' => ' + this.phone.exten;
            return name;
        }
    },
    methods: {
        async openExternal() {
            this.externalIsVisible = true;

            if (this.contact) {
                this.isLoading = true;

                const data = await Promise.all([
                    api.companies.getCompany(this.contact.company_id),
                    api.contacts.getContacts(this.contact.company_id)
                ]);

                this.company = data[0];
                this.companyContacts = data[1];

                this.isLoading = false;
            }
        },
        closeExternal() {
            this.externalIsVisible = false;

            if (this.contact) {
                this.company = null;
                this.companyContacts = [];
            }
        },
        async refreshContacts() {
            this.companyContacts = await api.contacts.getContacts(this.contact.company_id);
        },
        startEditing(contact) {
            this.editableContact = contact;
            this.companyContactFormIsVisible = true;
        },
        cancelEditing() {
            this.companyContactFormIsVisible = true;
            this.editableContact = null;
        }
    }
};
</script>
