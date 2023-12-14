<template>
    <div class="fuck">
        <Modal
            :title="formdata ? 'Изменение пользователя' : 'Создание пользователя'"
            @close="clickCloseModal"
            class="normal"
        >
            <Form @submit="onSubmit" class="p-2">
                <Loader class="center" v-if="loader"/>
                <FormGroup class="mb-1">
                    <Input
                        :disabled="!!formdata"
                        v-model="form.username"
                        :v="v$.form.username"
                        label="Юзернейм"
                        required
                        class="col-4 pr-1"
                    />
                    <Input
                        v-model="form.password"
                        :v="v$.form.password"
                        label="Пароль"
                        :required="!formdata"
                        class="col-4 pr-1"
                    />
                    <Input
                        :disabled="!!formdata"
                        v-model="form.userProfile.caller_id"
                        label="Добавочный номер"
                        maska="##########"
                        class="col-4 pr-1"
                    />
                </FormGroup>
                <FormGroup class="mb-1">
                    <Input
                        v-model="form.userProfile.middle_name"
                        label="Фамилия"
                        :v="v$.form.userProfile.middle_name"
                        required
                        class="col-4 pr-1"
                    />
                    <Input
                        v-model="form.userProfile.first_name"
                        label="Имя"
                        :v="v$.form.userProfile.first_name"
                        required
                        class="col-4 pr-1"
                    />
                    <Input
                        v-model="form.userProfile.last_name"
                        label="Отчество"
                        class="col-4"
                    />
                </FormGroup>
                <FormGroup class="mb-1">
                    <Input
                        v-model="form.email"
                        :v="v$.form.email"
                        label="Email для почты"
                        class="col-4 pr-1"
                        title="Необходим для отправки предложений с аккаунта пользователя"
                    />
                    <Input
                        v-model="form.email_username"
                        label="Email логин"
                        class="col-4 pr-1"
                        title="Необходим для отправки предложений с аккаунта пользователя"
                    />
                    <Input
                        v-model="form.email_password"
                        label="Email пароль"
                        class="col-4"
                        title="Необходим для отправки предложений с аккаунта пользователя"
                    />
                </FormGroup>
                <FormGroup class="mb-1">
                    <PropogationInput
                        v-model="form.userProfile.phones"
                        :v="v$.form.userProfile.phones"
                        label="Телефон"
                        name="phone"
                        :maska="[
              '+# (###) ###-##-##',
              '+## (###) ###-##-##',
              '+### (###) ###-##-##',
            ]"
                        class="col-4 pr-1"
                    />
                    <PropogationInput
                        v-model="form.userProfile.emails"
                        :v="v$.form.userProfile.emails"
                        label="Emails"
                        name="email"
                        class="col-4 pr-1"
                    />
                    <FileInput
                        v-model:native="form.userProfile.fileList"
                        v-model:data="form.userProfile.avatar"
                        label="Аватар"
                        class="col-4 text-center"
                        :multiple="false"
                        accept="image/jpeg,image/png,image/jpg"
                    >
                        Выбрать аватар
                    </FileInput>
                </FormGroup>
                <FormGroup class="mb-1">
                    <Radio
                        v-model="form.role"
                        class="col-12 p-0 mt-2 text-center"
                        label="Роль"
                        :options="roleOptions"
                    />
                </FormGroup>
                <FormGroup class="mt-4">
                    <Submit class="col-4 mx-auto">
                        {{ formdata ? "Сохранить" : "Создать" }}
                    </Submit>
                </FormGroup>
            </Form>
        </Modal>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import useValidate from "@vuelidate/core";
import {email, helpers, required} from "@vuelidate/validators";
import Form from "@/components/common/Forms/Form.vue";
import FormGroup from "@/components/common/Forms/FormGroup.vue";
import Input from "@/components/common/Forms/Input.vue";
import PropogationInput from "@/components/common/Forms/PropogationInput.vue";
import Submit from "@/components/common/Forms/Submit.vue";
import Radio from "@/components/common/Forms/Radio.vue";
import FileInput from "@/components/common/Forms/FileInput.vue";
import Utils, {validatePropogationInput} from "@/utils";
import {RoleList} from "@/const/const.js";
import Modal from "@/components/common/Modal.vue";
import Loader from "@/components/common/Loader.vue";

export default {
    name: "FormUser",
    components: {
        Loader,
        Modal,
        FormGroup,
        Form,
        Input,
        Submit,
        FileInput,
        PropogationInput,
        Radio
    },
    data() {
        return {
            v$: useValidate(),
            loader: false,
            roleOptions: RoleList.get("param"),
            form: {
                username: null,
                password: null,
                email: null,
                email_username: null,
                email_password: null,
                role: 2,
                userProfile: {
                    first_name: null,
                    middle_name: null,
                    last_name: null,
                    phones: [],
                    emails: [],
                    caller_id: null,
                    avatar: null,
                    fileList: [],
                },
            },
        };
    },
    props: {
        formdata: {
            type: Object,
            default: null,
        },
    },
    computed: {
        ...mapGetters(["CONSULTANT_LIST"]),
    },
    validations() {
        return {
            form: {
                userProfile: {
                    first_name: {
                        required: helpers.withMessage("введите имя", required),
                    },
                    middle_name: {
                        required: helpers.withMessage("введите фамилию", required),
                    },
                    emails: {
                        propogation: helpers.withMessage(
                            "Пустое поле не допустимо",
                            this.validateEmailsPropogation
                        ),
                        email: helpers.withMessage(
                            "заполните email правильно",
                            this.customEmailValidation
                        ),
                    },
                    phones: {
                        phones: {
                            propogation: helpers.withMessage(
                                "Пустое поле не допустимо",
                                this.validatePhonesPropogation
                            ),
                        },
                    },
                },
                username: {
                    required: helpers.withMessage("введите юзернейм", required),
                },
                password: {
                    customRequired: helpers.withMessage(
                        "введите пароль",
                        this.customRequired
                    ),
                },
                email: {
                    email: helpers.withMessage("заполните email правильно", email),
                },
            },
        };
    },
    methods: {
        ...mapActions(["CREATE_USER", "UPDATE_USER", "REFRESH_USER"]),

        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.form.$error) {
                this.loader = true;
                if (this.formdata) {
                    this.updateUser();
                } else {
                    this.createUser();
                }
            }
        },

        async updateUser() {
            if (await this.UPDATE_USER(this.form)) {
                this.$emit("updated");
                this.clickCloseModal();
                this.REFRESH_USER();
            }
            this.loader = false;
        },
        async createUser() {
            if (await this.CREATE_USER(this.form)) {
                this.$emit("created");

                this.clickCloseModal();
            }
            this.loader = false;
        },
        clickCloseModal() {
            this.$emit("closeUserForm");
        },
        validateEmailsPropogation() {
            return validatePropogationInput(this.form.userProfile.emails, "email");
        },
        validatePhonesPropogation() {
            return validatePropogationInput(this.form.userProfile.phones, "phone");
        },
        customEmailValidation() {
            let flag = true;
            this.form.userProfile.emails.forEach((item) => {
                if (!email.$validator(item.email)) {
                    flag = false;
                }
            });
            return flag;
        },
        customRequired(value) {
            if (!this.formdata) {
                if (value != null) {
                    return true;
                }
                return false;
            }
            return true;
        },
    },
    async mounted() {
        this.loader = true;
        if (this.formdata) {
            const cloneFormdata = JSON.stringify(this.formdata);
            this.form = {...this.form, ...JSON.parse(cloneFormdata)};
            this.form = Utils.normalizeDataForUserForm(this.form);
        }
        this.loader = false;
    },
    emits: ["closeUserForm", "updated", "created"],
};
</script>

<style>
</style>