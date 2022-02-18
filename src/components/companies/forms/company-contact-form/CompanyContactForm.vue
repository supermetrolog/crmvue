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
          <PropogationDoubleInput
            v-model="form.phones"
            :v="v$.form.phones"
            :maska="[
              '+7 (###) ###-##-###',
              '+### (###) ###-##-##',
              '+#### (###) ###-##-##',
            ]"
            placeholder="+7 "
            name="phone"
            name2="exten"
            label="Телефон"
            class="col-6 pr-1"
          />
          <PropogationInput
            v-model="form.emails"
            :v="v$.form.emails"
            name="email"
            label="Email"
            class="col-6 pr-1"
          />
        </FormGroup>
        <FormGroup class="mb-1">
          <Checkbox
            v-model="form.wayOfInformings"
            label="Способ информирования"
            class="col-6 pr-1"
            name="way"
            :options="wayOfInformings"
          />
          <MultiSelect
            v-model="form.position"
            :v="v$.form.position"
            @change="changePosition"
            required
            label="Должность"
            class="col-6 pr-1"
            :options="positionList"
          >
            <Checkbox
              v-model="form.position_unknown"
              @change="changePositionUnknown"
              label="Должность неизвестна"
              mode="inline"
              title="Должность неизвестна"
              class="col-12 p-0 mt-1 large text-center"
            />
          </MultiSelect>
        </FormGroup>
        <FormGroup class="mb-1">
          <MultiSelect
            v-model="form.consultant_id"
            label="Консультант"
            class="pr-1"
            :class="{ 'col-5': form.warning, 'col-6': !form.warning }"
            :v="v$.form.consultant_id"
            required
            :options="CONSULTANT_LIST"
          />

          <Checkbox
            v-model="form.good"
            label="Хор. взаим."
            title="Хорошие взаимоотношения"
            class="col-2 large text-center"
          />
          <Checkbox
            v-model="form.faceToFaceMeeting"
            label="Оч. встреча"
            title="Очная встреча"
            class="col-2 large text-center"
          />

          <Checkbox
            v-model="form.warning"
            label="Внимание!"
            @change="changeWarning"
            class="large text-center"
            :class="{ 'col-3': form.warning, 'col-2': !form.warning }"
          >
            <Textarea
              v-if="form.warning"
              v-model="form.warning_why_comment"
              :v="v$.form.warning_why_comment"
              required
              label="Причина"
              class="col-12 p-0 pt-1"
              placeholder="Опишите причину"
            />
          </Checkbox>
        </FormGroup>
        <FormGroup class="mb-1">
          <MultiSelect
            v-model="form.company_id"
            extraClasses="long-text"
            label="Компания"
            required
            class="col-6 pr-1"
            :v="v$.form.company_id"
            :filterResults="false"
            :minChars="1"
            :resolveOnLoad="true"
            :delay="0"
            :searchable="true"
            :options="
              async (query) => {
                return await searchCompany(query);
              }
            "
          />
          <Radio
            v-model="form.status"
            required
            label="Статус"
            class="col-6 text-center"
            :options="statusOptions"
          >
            <MultiSelect
              v-if="!form.status"
              v-model="form.passive_why"
              :v="v$.form.passive_why"
              required
              label="Причина пассива"
              class="col-12 p-0"
              :options="passiveWhyOptions"
            >
              <Textarea
                v-model="form.passive_why_comment"
                class="col-12 p-0 pt-1"
                placeholder="Опишите причину"
              />
            </MultiSelect>
          </Radio>
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
import { required, helpers, email } from "@vuelidate/validators";
import {
  FeedbackList,
  PositionList,
  ActivePassive,
  PassiveWhyContact,
} from "@/const/Const.js";
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import Submit from "@/components/common/form/Submit.vue";
import PropogationInput from "@/components/common/form/PropogationInput.vue";
import PropogationDoubleInput from "@/components/common/form/PropogationDoubleInput.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import Textarea from "@/components/common/form/Textarea.vue";
import Radio from "@/components/common/form/Radio.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import { validatePropogationInput } from "@/utils";
import api from "@/api/api";

export default {
  name: "CompanyContactForm",
  components: {
    FormGroup,
    Form,
    Input,
    Submit,
    PropogationInput,
    PropogationDoubleInput,
    Checkbox,
    Radio,
    MultiSelect,
    Textarea,
  },
  data() {
    return {
      v$: useValidate(),
      wayOfInformings: FeedbackList.get("contact"),
      positionList: PositionList.get("param"),
      statusOptions: ActivePassive.get("param"),
      passiveWhyOptions: PassiveWhyContact.get("param"),
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
        websites: [],
        passive_why: null,
        passive_why_comment: null,
        warning_why_comment: null,
        position_unknown: 0,
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
    phones: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(["CONSULTANT_LIST"]),
  },
  validations() {
    return {
      form: {
        position: {
          customRequredPosition: helpers.withMessage(
            "выберите должность",
            this.customRequiredPosition
          ),
        },
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
          customRequiredEmails: helpers.withMessage(
            "дабавьте либо телефон либо email",
            this.customRequiredEmails
          ),
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
          customRequiredPhones: helpers.withMessage(
            "дабавьте либо телефон либо email",
            this.customRequiredPhones
          ),
          phones: {
            propogation: helpers.withMessage(
              "Пустое поле не допустимо",
              this.validatePhonesPropogation
            ),
          },
        },
        passive_why: {
          customRequiredPassiveWhy: helpers.withMessage(
            "Выберите причину",
            this.customRequiredPassiveWhy
          ),
        },
        warning_why_comment: {
          customRequiredWarningWhyComment: helpers.withMessage(
            "Опишите причину",
            this.customRequiredWarningWhyComment
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
    changeWarning() {
      this.form.warning ? (this.form.good = 0) : "";
    },
    changePosition() {
      if (this.form.position !== null) {
        this.form.position_unknown = 0;
      }
    },
    changePositionUnknown() {
      if (this.form.position_unknown) {
        this.form.position = null;
      }
    },
    customRequiredPosition(value) {
      if (this.form.position_unknown) {
        return true;
      }
      return required.$validator(value);
    },
    validateEmailsPropogation() {
      return validatePropogationInput(this.form.emails, "email");
    },
    validatePhonesPropogation() {
      return validatePropogationInput(this.form.phones, "phone");
    },
    customEmailValidation() {
      let flag = true;
      this.form.emails.forEach((item) => {
        if (!email.$validator(item.email)) {
          flag = false;
        }
      });
      return flag;
    },
    customRequiredEmails() {
      if (this.form.emails.length) {
        return true;
      }
      if (!this.form.phones.length) {
        return false;
      }
      return true;
    },
    customRequiredPhones() {
      if (this.form.phones.length) {
        return true;
      }
      if (!this.form.emails.length) {
        return false;
      }
      return true;
    },
    customRequiredPassiveWhy() {
      if (this.form.status) {
        return true;
      }
      if (!required.$validator(this.form.passive_why)) {
        return false;
      }
      return true;
    },
    customRequiredWarningWhyComment() {
      if (!this.form.warning) {
        return true;
      }
      if (!required.$validator(this.form.warning_why_comment)) {
        return false;
      }
      return true;
    },
    async searchCompany(query) {
      let result = null;
      let array = [];
      if (this.formdata || this.company_id) {
        if (!this.selectedCompany) {
          this.selectedCompany = await api.companies.getCompany(
            this.formdata ? this.formdata.company_id : this.company_id
          );
        }

        array.push({
          value: this.selectedCompany.id,
          label: this.selectedCompany.full_name,
        });
      }
      result = await this.SEARCH_COMPANIES({
        query: { searchText: query },
        saveState: false,
      });
      result.forEach((item) => {
        array.push({ value: item.id, label: item.nameRu + " " + item.nameEng });
      });
      return array;
    },

    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
  },
  async mounted() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    this.form.company_id = this.company_id;
    this.form.phones = this.phones;
    if (this.formdata) {
      this.form = { ...this.form, ...this.formdata };
    }
    this.loader = false;
  },
  emits: ["closeCompanyForm", "updated", "created"],
};
</script>

<style>
</style>