<template>
  <div class="fuck">
    <Modal
      :title="formdata ? 'Изменение пользователя' : 'Создание пользователя'"
      @close="clickCloseModal"
      class="normal"
    >
      <Form @submit="onSubmit" class="p-2">
        <Loader class="center" v-if="loader" />
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
          <PropogationInput
            v-model="form.userProfile.contacts.phones"
            label="Телефон"
            :maska="[
              '+# (###) ###-##-##',
              '+## (###) ###-##-##',
              '+### (###) ###-##-##',
            ]"
            class="col-4 pr-1"
          />
          <PropogationInput
            v-model="form.userProfile.contacts.emails"
            label="Email"
            class="col-4 pr-1"
          />
          <FileInput
            v-model:native="form.userProfile.fileList"
            v-model:data="form.userProfile.avatar"
            label="Документы"
            class="col-4"
            :multiple="false"
            accept="image/jpeg,image/png,image/jpg"
          >
            Выбрать аватар
          </FileInput>
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
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Form from "@/components/form/Form.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import Input from "@/components/form/Input.vue";
import PropogationInput from "@/components/form/PropogationInput.vue";
import Submit from "@/components/form/Submit.vue";
import FileInput from "@/components/form/FileInput.vue";
import Utils from "@/utils";

export default {
  name: "UserForm",
  components: {
    FormGroup,
    Form,
    Input,
    Submit,
    FileInput,
    PropogationInput,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      form: {
        username: null,
        password: null,
        userProfile: {
          first_name: null,
          middle_name: null,
          last_name: null,
          contacts: {
            phones: [],
            emails: [],
          },
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
      },
    };
  },
  methods: {
    ...mapActions(["CREATE_USER", "UPDATE_USER"]),

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
      this.form = { ...this.form, ...JSON.parse(cloneFormdata) };
      this.form = Utils.normalizeDataForUserForm(this.form);
      console.log(this.form);
    }
    this.loader = false;
  },
  emits: ["closeUserForm", "updated", "created"],
};
</script>

<style>
</style>