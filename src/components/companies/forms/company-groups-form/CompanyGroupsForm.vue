<template>
  <div class="fuck">
    <Modal
      :title="
        formdata ? 'Изменение группы компаний' : 'Создание группы компаний'
      "
      @close="clickCloseModal"
      class="normal"
    >
      <Form @submit="onSubmit" class="p-2">
        <Loader class="center" v-if="loader" />
        <FormGroup class="mb-1">
          <Input
            v-model="form.nameRu"
            :v="v$.form.nameRu"
            label="Название Ru"
            required
            class="col-5 pr-1"
            :maska="{
              mask: 'Z*',
              tokens: { Z: { pattern: /[а-яА-Я0-9 ]/ } },
            }"
          />
          <Input
            v-model="form.nameEng"
            label="Название Eng"
            class="col-5 pr-1"
            :maska="{
              mask: 'Z*',
              tokens: { Z: { pattern: /[a-zA-Z0-9 ]/ } },
            }"
          />
          <MultiSelect
            v-model="form.formOfOrganization"
            label="ФО"
            title="Форма организации"
            class="col-2 pl-1"
            :options="formOfOrganizationOptions"
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Textarea
            v-model="form.description"
            label="Описание"
            class="col-12"
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
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import Form from "@/components/form/Form.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import Input from "@/components/form/Input.vue";
import Textarea from "@/components/form/Textarea.vue";
import Submit from "@/components/form/Submit.vue";
import MultiSelect from "@/components/form/MultiSelect.vue";
import { CompanyFormOrganization } from "@/const/Const.js";
export default {
  name: "UserForm",
  components: {
    FormGroup,
    Form,
    Input,
    Textarea,
    Submit,
    MultiSelect,
  },
  data() {
    return {
      v$: useValidate(),
      formOfOrganizationOptions: CompanyFormOrganization.get("param"),
      loader: false,
      form: {
        nameRu: null,
        nameEng: null,
        description: null,
        formOfOrganization: null,
      },
    };
  },
  props: {
    formdata: {
      type: Object,
      default: null,
    },
  },
  validations() {
    return {
      form: {
        nameRu: {
          required: helpers.withMessage("введите название", required),
        },
      },
    };
  },
  methods: {
    ...mapActions(["CREATE_COMPANY_GROUPS", "UPDATE_COMPANY_GROUPS"]),

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
        this.$emit("updated");
        this.clickCloseModal();
      }
      this.loader = false;
    },
    async create() {
      if (await this.CREATE_COMPANY_GROUPS(this.form)) {
        this.$emit("created");

        this.clickCloseModal();
      }
      this.loader = false;
    },
    clickCloseModal() {
      this.$emit("closeCompanyGroupsForm");
    },
  },
  async mounted() {
    this.loader = true;
    if (this.formdata) {
      const cloneFormdata = JSON.stringify(this.formdata);
      this.form = { ...this.form, ...JSON.parse(cloneFormdata) };
      console.log(this.form);
    }
    this.loader = false;
  },
  emits: ["closeCompanyGroupsForm", "updated", "created"],
};
</script>

<style>
</style>