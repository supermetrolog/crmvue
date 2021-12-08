<template>
  <div class="fuck">
    <Modal
      :title="formdata ? 'Изменение контакта' : 'Создание контакта'"
      @close="clickCloseModal"
      class="normal"
    >
      <Form @submit="onSubmit" class="p-2">
        <Loader class="center" v-if="loader" />
        <FormGroup class="mb-1">
          <Input
            v-model="form.middle_name"
            label="Фамилия"
            class="col-4 pr-1"
          />
          <Input
            v-model="form.first_name"
            label="Имя"
            :v="v$.form.first_name"
            required
            class="col-4 pr-1"
          />
          <Input v-model="form.last_name" label="Отчество" class="col-4" />
        </FormGroup>

        <FormGroup class="mb-1">
          <MultiSelect
            v-model="form.position"
            label="Должность"
            class="col-4 pr-1"
            :options="positionList"
          />
          <MultiSelect
            v-model="form.consultant_id"
            label="Консультант"
            class="col-4 pr-1"
            :v="v$.form.consultant_id"
            required
            :options="CONSULTANT_LIST"
          />
          <MultiSelect
            v-model="form.company_id"
            extraClasses="long-text"
            label="Компания"
            required
            class="col-4 pr-1"
            :v="v$.form.company_id"
            :filterResults="false"
            :minChars="1"
            :resolveOnLoad="formdata ? true : false"
            :delay="0"
            :searchable="true"
            :options="
              async (query) => {
                return await searchCompany(query);
              }
            "
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Checkbox
            v-model="form.warning"
            label="Внимание!"
            class="col-3 pr-1 large text-center"
          />
          <Checkbox
            v-model="form.faceToFaceMeeting"
            label="Оч. встреча"
            title="Очная встреча"
            class="col-3 large text-center"
          />
          <Checkbox
            v-model="form.good"
            label="Хор. взаим."
            title="Хорошие взаимоотношения"
            class="col-3 large text-center"
          />
          <Radio
            v-model="form.status"
            required
            label="Статус"
            class="col-3 text-center"
            :options="statusOptions"
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <PropogationInput
            v-model="form.phones"
            :maska="[
              '+# (###) ###-##-##',
              '+## (###) ###-##-##',
              '+### (###) ###-##-##',
            ]"
            label="Телефон"
            :v="v$.form.emails"
            class="col-4 pr-1"
          />
          <PropogationInput
            v-model="form.emails"
            label="Email"
            :v="v$.form.emails"
            class="col-4 pr-1"
          />
          <Checkbox
            v-model="form.wayOfInformings"
            label="Способ информирования"
            class="col-4"
            :options="wayOfInformings"
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
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { FeedbackList, PositionList, ActivePassive } from "@/const/Const.js";
import Form from "@/components/form/Form.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import Input from "@/components/form/Input.vue";
import Submit from "@/components/form/Submit.vue";
import PropogationInput from "@/components/form/PropogationInput.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Radio from "@/components/form/Radio.vue";
import MultiSelect from "@/components/form/MultiSelect.vue";
import Utils from "@/utils";
import api from "@/api/api";

export default {
  name: "CompanyContactForm",
  components: {
    FormGroup,
    Form,
    Input,
    Submit,
    PropogationInput,
    Checkbox,
    Radio,
    MultiSelect,
  },
  data() {
    return {
      v$: useValidate(),
      wayOfInformings: FeedbackList.get("contact"),
      positionList: PositionList.get("param"),
      statusOptions: ActivePassive.get("param"),
      loader: false,
      selectedCompany: null,
      form: {
        company_id: null,
        first_name: null,
        middle_name: null,
        last_name: null,
        position: null,
        faceToFaceMeeting: 0,
        warning: 0,
        good: 0,
        status: 1,
        wayOfInformings: [],
        consultant_id: null,
        phones: [],
        emails: [],
      },
    };
  },
  props: {
    formdata: {
      type: Object,
      default: null,
    },
    company_id: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["CONSULTANT_LIST"]),
  },
  validations() {
    return {
      form: {
        consultant_id: {
          required: helpers.withMessage("выберите консультанта", required),
        },
        first_name: {
          required: helpers.withMessage("введите имя", required),
        },
        company_id: {
          required: helpers.withMessage("Выберите компанию", required),
        },
        emails: {
          customRequired: helpers.withMessage(
            "дабавьте либо телефон либо email",
            this.customRequired
          ),
        },
      },
    };
  },
  methods: {
    ...mapActions([
      "FETCH_CONSULTANT_LIST",
      "CREATE_CONTACT",
      "UPDATE_CONTACT",
      "SEARCH_COMPANIES",
    ]),
    async onSubmit() {
      this.v$.$validate();
      if (!this.v$.form.$error) {
        this.loader = true;
        if (this.formdata) {
          this.updateContact();
        } else {
          this.createContact();
        }
      }
    },

    async updateContact() {
      if (await this.UPDATE_CONTACT(this.form)) {
        this.$emit("updated");
        this.clickCloseModal();
      }
      this.loader = false;
    },
    async createContact() {
      if (await this.CREATE_CONTACT(this.form)) {
        this.$emit("created");

        this.clickCloseModal();
      }
      this.loader = false;
    },
    async searchCompany(query) {
      let result = null;
      let array = [];
      if (!this.selectedCompany) {
        this.selectedCompany = await api.companies.getCompany(
          this.formdata.company_id
        );
      }
      if (this.formdata && this.selectedCompany) {
        array.push({
          value: this.selectedCompany[0].id,
          label:
            this.selectedCompany[0].nameRu +
            " - " +
            this.selectedCompany[0].nameEng,
        });
      }
      result = await this.SEARCH_COMPANIES(
        { nameRu: query, nameEng: query },
        false
      );
      console.log("RESULT: ", array);
      result.forEach((item) => {
        array.push({ value: item.id, label: item.nameRu + " " + item.nameEng });
      });
      return array;
    },
    customRequired() {
      if (this.form.emails.length == 1 && this.form.phones.length == 1) {
        if (this.form.emails[0] == "" && this.form.phones[0] == "") {
          return false;
        }
      }
      return true;
    },
    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
  },
  async mounted() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    this.form.company_id = this.company_id;
    if (this.formdata) {
      const cloneFormdata = JSON.stringify(this.formdata);
      this.form = { ...this.form, ...JSON.parse(cloneFormdata) };
      this.form = Utils.normalizeDataForContactForm(this.form);
    }
    this.loader = false;
  },
  emits: ["closeCompanyForm", "updated", "created"],
};
</script>

<style>
</style>