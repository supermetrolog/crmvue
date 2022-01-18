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
            class="col-4 pr-1"
          />
          <Input
            v-model="form.nameEng"
            label="Название Eng"
            class="col-4 pr-1"
          />
          <Textarea v-model="form.description" label="Описание" />
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

export default {
  name: "UserForm",
  components: {
    FormGroup,
    Form,
    Input,
    Textarea,
    Submit,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      form: {
        nameRu: null,
        nameEng: null,
        description: null,
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