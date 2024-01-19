<template>
    <Modal
        @close="clickCloseModal"
        :title="formdata ? 'Изменение группы компаний' : 'Создание группы компаний'"
        class="modal-form-company-group"
    >
        <Form @submit="onSubmit">
            <Loader v-if="loader" class="center" />
            <FormGroup>
                <Input
                    v-model="form.nameRu"
                    :v="v$.form.nameRu"
                    label="Название Ru"
                    required
                    class="col-12 mb-2"
                    :maska="{
                        mask: 'Z*',
                        tokens: { Z: { pattern: /[а-яА-Я0-9 ]/ } }
                    }"
                />
                <Input
                    v-model="form.nameEng"
                    label="Название Eng"
                    class="col-8"
                    :maska="{
                        mask: 'Z*',
                        tokens: { Z: { pattern: /[a-zA-Z0-9 ]/ } }
                    }"
                />
                <MultiSelect
                    v-model="form.formOfOrganization"
                    label="ФО"
                    title="Форма организации"
                    class="col-4"
                    :options="formOfOrganizationOptions"
                />
            </FormGroup>
            <FormGroup>
                <Textarea v-model="form.description" label="Описание" class="col-12" />
            </FormGroup>
            <Submit success center class="mt-3 mx-auto">
                {{ formdata ? 'Сохранить' : 'Создать' }}
            </Submit>
        </Form>
    </Modal>
</template>

<script>
import { mapActions } from 'vuex';
import useValidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import Textarea from '@/components/common/Forms/Textarea.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { CompanyFormOrganization } from '@/const/const.js';
import Loader from '@/components/common/Loader.vue';
import Modal from '@/components/common/Modal.vue';
import { onlyRussian } from '@//validators';
import Submit from '@/components/common/Forms/Submit.vue';

export default {
    name: 'FormCompanyGroup',
    components: {
        Submit,
        Modal,
        Loader,
        FormGroup,
        Form,
        Input,
        Textarea,
        MultiSelect
    },
    emits: ['closeCompanyGroupsForm', 'updated', 'created'],
    props: {
        formdata: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            v$: useValidate(),
            loader: false,
            form: {
                nameRu: null,
                nameEng: null,
                description: null,
                formOfOrganization: null
            }
        };
    },
    computed: {
        formOfOrganizationOptions: () => CompanyFormOrganization
    },
    validations() {
        return {
            form: {
                nameRu: {
                    required: helpers.withMessage('Введите название', required),
                    onlyRussian: helpers.withMessage(
                        'Название должно быть на русском языке',
                        onlyRussian
                    )
                }
            }
        };
    },
    methods: {
        ...mapActions(['CREATE_COMPANY_GROUPS', 'UPDATE_COMPANY_GROUPS']),

        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.loader = true;
                if (this.formdata) {
                    this.update();
                } else {
                    this.create();
                }
            }
        },

        async update() {
            if (await this.UPDATE_COMPANY_GROUPS(this.form)) {
                this.$emit('updated');
                this.clickCloseModal();
            }
            this.loader = false;
        },
        async create() {
            if (await this.CREATE_COMPANY_GROUPS(this.form)) {
                this.$emit('created');

                this.clickCloseModal();
            }
            this.loader = false;
        },
        clickCloseModal() {
            this.$emit('closeCompanyGroupsForm');
        }
    },
    async mounted() {
        this.loader = true;
        if (this.formdata) {
            const cloneFormdata = JSON.stringify(this.formdata);
            this.form = { ...this.form, ...JSON.parse(cloneFormdata) };
        }
        this.loader = false;
    }
};
</script>

<style></style>
