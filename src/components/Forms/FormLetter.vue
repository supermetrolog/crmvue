<template>
    <div class="send-objects">
        <div class="row no-gutters">
            <div class="col-12">
                <Form @submit="onSubmit" class="autosize">
                    <Loader v-if="loader" class="center" />
                    <FormGroup class="mb-2">
                        <div class="col-2">
                            <button class="btn btn-primary">Отправить</button>
                        </div>

                        <MultiSelect
                            ref="contactSelect"
                            v-model="form.contactForSendMessage"
                            :withoutLabel="true"
                            required
                            :v="v$.form.contactForSendMessage"
                            :options="contactsOptions"
                            :clearOnSelect="true"
                            :closeOnSelect="false"
                            :hideSelected="false"
                            :groups="true"
                            class="col-4"
                            :multipleLabel="
                                n => {
                                    return `${n.length} ${n.length == 1 ? 'контакт выбран' : 'контакта выбрано'}`;
                                }
                            "
                            placeholder="Выберите контакт"
                            mode="multiple"
                        >
                            <div class="col-12 align-self-center">
                                {{ form.contactForSendMessage.map(elem => elem.value).join(', ') }}
                            </div>
                        </MultiSelect>
                        <Checkbox
                            v-model="form.selfSend"
                            @change="clickSendMe"
                            label="Отправить себе"
                            class="col-1 large ml-5"
                            :falseValue="0"
                            mode="inline"
                        />
                        <CheckboxIcons
                            v-if="alreadySended"
                            v-model="form.wayOfSending"
                            :v="v$.form.wayOfSending"
                            required
                            label="Способ связи"
                            class="text-center col-3"
                            :options="wayOfSendingOptions"
                        />
                    </FormGroup>
                    <FormGroup v-if="!alreadySended" class="mb-2">
                        <Input v-model="form.subject" class="col-12" placeholder="Тема письма" />
                    </FormGroup>
                    <FormGroup v-if="!alreadySended" class="mb-2 pb-5">
                        <VueEditor v-model="form.message" class="col-12" :editorToolbar="customToolbar" />
                    </FormGroup>
                </Form>
            </div>
        </div>
        <div class="row no-gutters">
            <div class="col-12">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import CheckboxIcons from '@/components/common/Forms/CheckboxIcons.vue';
import Input from '@/components/common/Forms/Input.vue';
import { VueEditor } from 'vue3-editor';
import { mapGetters } from 'vuex';
import { WayOfSending } from '@/const/const.js';
import Utils, { contains } from '@/utils';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import Loader from '@/components/common/Loader.vue';

export default {
    name: 'FormLetter',
    components: {
        Loader,
        MultiSelect,
        Form,
        FormGroup,
        Input,
        CheckboxIcons,
        VueEditor,
        Checkbox
    },
    props: {
        alreadySended: {
            type: Boolean,
            default: false
        },
        formdata: {
            type: Object
        },
        loader: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            v$: useValidate(),
            wayOfSendingOptions: WayOfSending.get('param'),
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
            }
        };
    },
    validations() {
        return {
            form: {
                contactForSendMessage: {
                    required: helpers.withMessage('выберите контакт', required)
                },
                wayOfSending: {
                    required: helpers.withMessage('выберите способ связи', required),
                    requiredPhone: helpers.withMessage(
                        'Выберите способ связи для номеров телефона',
                        this.requiredPhone
                    ),
                    requiredEmail: helpers.withMessage(
                        'Выберите способ связи для электронной почты',
                        this.requiredEmail
                    )
                },
                company_id: {
                    required: helpers.withMessage('выберите компанию', required)
                }
            }
        };
    },
    computed: {
        ...mapGetters(['COMPANY_CONTACTS', 'THIS_USER']),
        companyContacts() {
            if (this.alreadySended) return Utils.normalizeContactsForMultiselect(this.COMPANY_CONTACTS);

            return Utils.normalizeContactsForMultiselectOnlyEmails(this.COMPANY_CONTACTS);
        }
    },
    watch: {
        form: {
            handler() {},
            deep: true
        },
        companyContacts() {
            this.contactsOptions = this.companyContacts;
        }
    },

    methods: {
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
                !contains(this.form.wayOfSending, [1, 2, 3, 4])
            ) {
                return false;
            }
            return true;
        },
        requiredEmail() {
            if (
                this.form.contactForSendMessage.find(elem => elem.type === 1) &&
                !contains(this.form.wayOfSending, [0])
            ) {
                return false;
            }
            return true;
        },
        clickSendMe() {
            if (!this.THIS_USER.userProfile.emails || !this.THIS_USER.userProfile.emails.length) {
                setTimeout(() => (this.form.selfSend = 0), 0); // Без этого watcher в компоненте Checkbox не срабатывает
                return;
            }
            let groupName = 'Себе: ' + this.THIS_USER.userProfile.short_name;
            const alreadyPushedSelfContacts = this.contactsOptions.find(group => group.label === groupName);
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
                this.contactsOptions = this.contactsOptions.filter(group => group.label != groupName);
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
            setTimeout(() => this.$refs.contactSelect.$refs.multiselect.select(contacts[0]), 100);
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
            this.clickSendMe();
        }
    }
};
</script>

<style></style>