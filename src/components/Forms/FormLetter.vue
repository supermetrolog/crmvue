<template>
    <div class="row">
        <div class="col-12">
            <UiForm @submit="onSubmit">
                <Loader v-if="loading" />
                <FormGroup class="mb-1">
                    <MultiSelect
                        ref="contactSelect"
                        v-model="form.contactForSendMessage"
                        :without-label="true"
                        required
                        :v="v$.form.contactForSendMessage"
                        :options="contactsOptions"
                        :clear-on-select="true"
                        :close-on-select="false"
                        :hide-selected="false"
                        :groups="true"
                        class="col-8"
                        :multiple-label="
                            n =>
                                plural(
                                    n.length,
                                    '%d контакт выбран',
                                    '%d контакта выбрано',
                                    '%d контактов выбрано'
                                )
                        "
                        placeholder="Выберите контакт"
                        mode="multiple"
                        label="Контакт клиента"
                    >
                        <template #after>
                            <div class="d-flex">
                                <CheckboxChip
                                    v-model="form.selfSend"
                                    @change="changeSelfSend"
                                    :value="form.selfSend"
                                    text="Отправить себе"
                                    :rounded="false"
                                    show-checkbox
                                />
                            </div>
                        </template>
                    </MultiSelect>
                    <CheckboxIcons
                        v-if="alreadySended"
                        v-model="form.wayOfSending"
                        :v="v$.form.wayOfSending"
                        required
                        label="Способ связи"
                        :options="wayOfSendingOptions"
                        class="col-4"
                    />
                </FormGroup>
                <AnimationTransition :speed="0.5">
                    <FormGroup v-if="form.contactForSendMessage?.length">
                        <div class="col-12">
                            <p class="mb-1">Выбранные контакты:</p>
                            <div class="d-flex gap-1 flex-wrap">
                                <DashboardChip
                                    v-for="(contact, key) in form.contactForSendMessage"
                                    :key="key"
                                    class="dashboard-bg-light"
                                >
                                    {{ contact.value }}
                                </DashboardChip>
                            </div>
                        </div>
                    </FormGroup>
                </AnimationTransition>
                <template v-if="!alreadySended">
                    <FormGroup class="mb-2">
                        <Input v-model="form.subject" class="col-12" placeholder="Тема письма" />
                    </FormGroup>
                    <FormGroup class="mb-2">
                        <VueEditor v-model="form.message" class="col-12" />
                    </FormGroup>
                </template>
                <UiFormDivider />
                <UiFormGroup>
                    <UiCol :cols="12">
                        <Submit class="w-100" :disabled="disabled || v$?.$errors?.length" success>
                            Отправить
                        </Submit>
                    </UiCol>
                </UiFormGroup>
            </UiForm>
        </div>
        <div class="col-12">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import CheckboxIcons from '@/components/common/Forms/CheckboxIcons.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { mapGetters } from 'vuex';
import { WayOfSendingList } from '@/const/const.js';
import Utils from '@/utils';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Loader from '@/components/common/Loader.vue';
import Submit from '@/components/common/Forms/FormSubmit.vue';
import { plural } from '@/utils/plural.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import { contains } from '@/utils/helpers/array/contains.js';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiCol from '@/components/common/UI/UiCol.vue';

export default {
    name: 'FormLetter',
    components: {
        UiCol,
        UiFormGroup,
        UiFormDivider,
        UiForm,
        VueEditor,
        CheckboxChip,
        AnimationTransition,
        DashboardChip,
        Submit,
        Loader,
        MultiSelect,
        FormGroup: UiFormGroup,
        Input: UiInput,
        CheckboxIcons
    },
    props: {
        alreadySended: Boolean,
        formdata: Object,
        disabled: Boolean,
        loading: Boolean
    },
    data() {
        return {
            v$: useValidate(),
            customToolbar: [
                [{ header: [false, 1, 2, 3, 4, 5, 6] }],
                ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                ['clean'] // remove formatting button
            ],
            contactsOptions: null,
            form: {
                selfSend: 0,
                contacts: {
                    emails: [],
                    phones: []
                },
                contactForSendMessage: [],
                wayOfSending: [],
                message: null,
                subject: null,
                company_id: null
            },
            isLoading: false
        };
    },
    validations() {
        return {
            form: {
                contactForSendMessage: {
                    required: helpers.withMessage('Выберите контакт', required),
                    requiredPhoneIfWayExist: helpers.withMessage(
                        'Выберите телефон для привязки к выбранному методу связи',
                        this.requiredPhoneIfWayExistValidator
                    ),
                    requiredEmailIfWayExist: helpers.withMessage(
                        'Выберите почту для привязки к выбранному методу связи',
                        this.requiredEmailIfWayExistValidator
                    )
                },
                wayOfSending: {
                    required: helpers.withMessage('Выберите способ связи', required),
                    requiredPhone: helpers.withMessage(
                        'Выберите способ связи для номеров телефона',
                        this.requiredPhone
                    ),
                    requiredEmail: helpers.withMessage(
                        'Выберите способ связи для электронной почты',
                        this.requiredEmail
                    )
                }
            }
        };
    },
    computed: {
        ...mapGetters(['COMPANY_CONTACTS', 'THIS_USER']),
        wayOfSendingOptions: () => WayOfSendingList,
        companyContacts() {
            if (this.alreadySended)
                return Utils.normalizeContactsForMultiselect(this.COMPANY_CONTACTS);

            return Utils.normalizeContactsForMultiselectOnlyEmails(this.COMPANY_CONTACTS);
        }
    },
    watch: {
        companyContacts() {
            this.contactsOptions = this.companyContacts;
        }
    },

    methods: {
        plural,
        async onSubmit() {
            await this.v$.$validate();
            if (this.v$.form.$error) return;

            this.normalizeContacts();

            if (this.alreadySended) {
                this.form.message = null;
                this.form.subject = null;
                this.$emit('alreadySent', this.form);
            } else {
                this.$emit('send', this.form);
            }
        },
        normalizeContacts() {
            let emails = this.form.contactForSendMessage.filter(elem => elem.type === 1);
            if (emails) {
                this.form.contacts.emails = emails.map(elem => {
                    return { contact_id: elem.contact_id, value: elem.value };
                });
            }

            let phones = this.form.contactForSendMessage.filter(elem => elem.type === 0);
            if (phones) {
                this.form.contacts.phones = phones.map(elem => {
                    return { contact_id: elem.contact_id, value: elem.value };
                });
            }
            this.form.selfSend = this.formdata.selfSend;
        },
        requiredPhone() {
            if (
                this.form.contactForSendMessage.find(elem => elem.type === 0) &&
                !contains.any(this.form.wayOfSending, [1, 2, 3, 4])
            ) {
                return false;
            }
            return true;
        },
        requiredEmail() {
            if (
                this.form.contactForSendMessage.find(elem => elem.type === 1) &&
                !contains.any(this.form.wayOfSending, [0])
            ) {
                return false;
            }
            return true;
        },
        requiredPhoneIfWayExistValidator() {
            return !(
                contains.any(this.form.wayOfSending, [1, 2, 3, 4]) &&
                !contains.anyWithProperty(this.form.contactForSendMessage, 'type', [0])
            );
        },
        requiredEmailIfWayExistValidator() {
            return !(
                contains.any(this.form.wayOfSending, [0]) &&
                !contains.anyWithProperty(this.form.contactForSendMessage, 'type', [1])
            );
        },
        changeSelfSend() {
            if (!this.THIS_USER.userProfile.emails?.length) {
                this.form.selfSend = 0;
                return;
            }

            let groupName = 'Себе: ' + this.THIS_USER.userProfile.short_name;
            const alreadyPushedSelfContacts = this.contactsOptions.find(
                group => group.label === groupName
            );
            const contacts = [];
            this.THIS_USER.userProfile.emails.forEach(email => {
                contacts.push({
                    label: email.email,
                    value: {
                        type: 1,
                        id: 'hui',
                        contact_id: null,
                        value: email.email
                    }
                });
            });

            if (alreadyPushedSelfContacts) {
                this.contactsOptions = this.contactsOptions.filter(
                    group => group.label != groupName
                );
                let beforeSelectedContacts = [...this.form.contactForSendMessage];
                this.$refs.contactSelect.$refs.multiselect.clear();
                beforeSelectedContacts = beforeSelectedContacts.filter(elem => elem.id != 'hui');
                beforeSelectedContacts.forEach(elem =>
                    this.$refs.contactSelect.$refs.multiselect.select({
                        label: elem.email,
                        value: elem
                    })
                );
                contacts.forEach(elem => {
                    this.$refs.contactSelect.$refs.multiselect.remove(elem);
                });
                return;
            }

            this.contactsOptions.push({
                label: groupName,
                options: contacts
            });

            this.$nextTick(() => {
                this.$refs.contactSelect.$refs.multiselect.select(contacts[0]);
            });
        },
        setDefaultContact() {
            if (this.formdata && this.formdata.defaultContactForSend) {
                this.companyContacts.forEach(group => {
                    let findedContact = group.options.find(
                        contact =>
                            contact.value.id === this.formdata.defaultContactForSend.id &&
                            contact.value.type === this.formdata.defaultContactForSend.type
                    );
                    if (findedContact) {
                        this.$refs.contactSelect.$refs.multiselect.select(findedContact);
                    }
                });
            }
        }
    },
    mounted() {
        this.setDefaultContact();
        this.contactsOptions = this.companyContacts;
        this.form = { ...this.form, ...this.formdata };

        if (this.form.selfSend === 1) {
            this.changeSelfSend();
        }
    }
};
</script>

<style></style>
