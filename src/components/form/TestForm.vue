<template>
  <div class="test">
    <Modal title="Создание компании" @close="$emit('closeCompanyForm')">
      <Form @submit="onSubmit">
        <Tabs :options="{ useUrlFragment: false }">
          <Loader class="center" v-if="loader" />

          <Tab name="Основное">
            <FormGroup>
              <Checkbox v-model="form.noName" label="Нет" class="col-1 large" />
              <Input
                v-if="!form.noName"
                v-model="form.nameEng"
                :v="v$.form.nameEng"
                required
                label="Название Eng"
                class="col-6 pr-1"
              />
              <Input
                v-if="!form.noName"
                v-model="form.nameRu"
                :v="v$.form.nameRu"
                required
                label="Название Ru"
                class="col-5 pl-1"
              />
              <!-- <Input
                v-model="form.input"
                required
                label="Input"
                placeholder="От:"
                class="col-3 pr"
                :v="v$.form.input"
              >
                <Input
                  v-model="form.input"
                  :v="v$.form.input"
                  required
                  class="px-0 mt-1"
                  placeholder="До:"
                />
              </Input> -->
            </FormGroup>
            <FormGroup>
              <Input
                v-model="form.officeAddress"
                label="Адрес офиса"
                class="col-4 pr-1"
              />
              <MultiSelect
                v-model="form.formOfOrganization"
                label="Форма организации"
                class="col-4 px-1"
                :options="formOfOrganizationOptions"
              />
              <MultiSelect
                v-model="form.companyGroup_id"
                label="Входит в ГК"
                class="col-4 pl-1"
                :options="COMPANY_GROUP_LIST"
              />
            </FormGroup>
            <FormGroup>
              <Checkbox
                v-model="form.categories"
                :v="v$.form.categories"
                :options="categoryOptions"
                required
                label="Категория"
                class="col-7"
              />
              <Radio
                v-model="form.status"
                :v="v$.form.status"
                required
                label="Статус"
                class="col-2"
                :options="statusOptions"
              />
              <MultiSelect
                v-model="form.consultant_id"
                :v="v$.form.consultant_id"
                required
                label="Консультант"
                class="col-3 pl-1"
                :options="CONSULTANT_LIST"
              />
            </FormGroup>
            <FormGroup>
              <PropogationInput
                v-model="form.contacts.phones"
                :maska="[
                  '+# (###) ###-##-##',
                  '+## (###) ###-##-##',
                  '+### (###) ###-##-##',
                ]"
                label="Телефон"
                class="col-4 pr-1"
              />
              <PropogationInput
                v-model="form.contacts.emails"
                label="Email"
                class="col-4 pr-1"
              />
              <PropogationInput
                v-model="form.contacts.websites"
                label="Вебсайт"
                class="col-4 pr-1"
              />
            </FormGroup>
            <FormGroup>
              <MultiSelect
                v-model="form.activityGroup"
                :v="v$.form.activityGroup"
                required
                label="Группа деятельности"
                class="col-4 pr-1"
                :options="CONSULTANT_LIST"
              />
              <MultiSelect
                v-model="form.activityProfile"
                :v="v$.form.activityProfile"
                required
                label="Профиль деятельности"
                class="col-4 px-1"
                :options="CONSULTANT_LIST"
              />
              <MultiSelect
                v-model="form.productRanges"
                :v="v$.form.productRanges"
                required
                label="Номенклатура товара"
                class="col-4 pl-1"
                :options="CONSULTANT_LIST"
              />
            </FormGroup>
            <FormGroup>
              <Textarea
                v-model="form.description"
                label="Описание"
                class="col-6 pr-1"
              />
              <FileInput
                v-model:native="form.fileList"
                v-model:data="form.files"
                label="Документы"
                class="col-6 pl-1"
              >
                Выбрать файлы
              </FileInput>
            </FormGroup>
          </Tab>

          <Tab name="Реквизиты">
            <FormGroup>
              <Checkbox
                v-model="form.checkbox"
                :options="categoryOptions"
                required
                label="Checkbox"
                class="col-4"
              />
              <Radio
                v-model="form.radio"
                :v="v$.form.radio"
                required
                label="Radio sd"
                class="col-5"
                :options="categoryOptions"
              />
              <!-- <Radio
          v-model="form.radio2"
          required
          label="Radio2"
          class="col-2 large"
        />
        <PropogationInput
          v-model="form.input2"
          required
          :maska="[
            '+# (###) ###-##-##',
            '+## (###) ###-##-##',
            '+### (###) ###-##-##',
          ]"
          label="PropogationInput"
          class="col-4"
        />
        <Textarea v-model="form.input" required label="Input" class="col-12" />
        <FileInput
          v-model:native="form.fileList"
          v-model:data="form.files"
          label="Документы"
          class="col-2"
        >
          Выбрать файлы
        </FileInput> -->
            </FormGroup>
          </Tab>

          <FormGroup class="mt-2">
            <Submit class="col-4 mx-auto"> Создать </Submit>
          </FormGroup>
        </Tabs>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Form from "./Form.vue";
import FormGroup from "./FormGroup.vue";
import Input from "./Input.vue";
import Submit from "./Submit.vue";
import Textarea from "./Textarea.vue";
import FileInput from "./FileInput.vue";
import PropogationInput from "./PropogationInput.vue";
import Checkbox from "./Checkbox.vue";
import Radio from "./Radio.vue";
import MultiSelect from "./MultiSelect.vue";
import useValidate from "@vuelidate/core";
import Loader from "@/components/Loader";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import {
  CompanyCategories,
  ActivePassive,
  CompanyFormOrganization,
} from "@/const/Const.js";
import Utils from "@/utils";

export default {
  name: "TestForm",
  components: {
    FormGroup,
    Form,
    Input,
    Submit,
    PropogationInput,
    Textarea,
    Checkbox,
    Radio,
    MultiSelect,
    FileInput,
    Loader,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      categoryOptions: CompanyCategories.get("param"),
      formOfOrganizationOptions: CompanyFormOrganization.get("param"),
      statusOptions: ActivePassive.get("param"),
      form: {
        activityGroup: null,
        activityProfile: null,
        basis: null,
        bik: null,
        categories: [],
        checkingAccount: null,
        companyGroup_id: null,
        consultant_id: null,
        contacts: { phones: [""], emails: [""], websites: [""] },
        correspondentAccount: null,
        description: null,
        documentNumber: null,
        formOfOrganization: null,
        inTheBank: null,
        inn: null,
        kpp: null,
        legalAddress: null,
        nameEng: null,
        nameRu: null,
        noName: 0,
        officeAddress: null,
        ogrn: null,
        okpo: null,
        okved: null,
        productRanges: [],
        signatoryLastName: null,
        signatoryMiddleName: null,
        signatoryName: null,
        status: 1,
        files: [],
        fileList: [],
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
    ...mapGetters(["COMPANY", "CONSULTANT_LIST", "COMPANY_GROUP_LIST"]),
  },
  validations() {
    return {
      form: {
        nameEng: {
          customRequired: helpers.withMessage(
            "заполните поле",
            this.customRequired
          ),
          minLength: helpers.withMessage(
            "название не может быть меньше 3 символов",
            minLength(3)
          ),
          maxLength: helpers.withMessage(
            "название не может быть больше 60 символов",
            maxLength(60)
          ),
        },
        nameRu: {
          customRequired: helpers.withMessage(
            "заполните поле",
            this.customRequired
          ),
          minLength: helpers.withMessage(
            "название не может быть меньше 3 символов",
            minLength(3)
          ),
          maxLength: helpers.withMessage(
            "название не может быть больше 60 символов",
            maxLength(60)
          ),
        },
        categories: {
          required: helpers.withMessage("выберите категорию", required),
        },

        status: {
          required: helpers.withMessage("Выберите статус", required),
        },
        consultant_id: {
          required: helpers.withMessage("Выберите консультанта", required),
        },
        ogrn: {
          minLength: helpers.withMessage(
            "огрн не может быть меньше 13 символов",
            minLength(13)
          ),
        },
        inn: {
          minLength: helpers.withMessage(
            "инн не может быть меньше 12 символов",
            minLength(12)
          ),
        },
        kpp: {
          minLength: helpers.withMessage(
            "кпп не может быть меньше 9 символов",
            minLength(9)
          ),
        },
        checkingAccount: {
          minLength: helpers.withMessage(
            "расчетный счет не может быть меньше 20 символов",
            minLength(20)
          ),
        },
        correspondentAccount: {
          minLength: helpers.withMessage(
            "корреспондентский счет не может быть меньше 20 символов",
            minLength(20)
          ),
        },
        bik: {
          minLength: helpers.withMessage(
            "бик не может быть меньше 9 символов",
            minLength(9)
          ),
        },
        okved: {
          minLength: helpers.withMessage(
            "оквэд не может быть меньше 4 символов",
            minLength(4)
          ),
        },
        okpo: {
          minLength: helpers.withMessage(
            "окпо не может быть меньше 8 символов",
            minLength(8)
          ),
        },
        activityGroup: {
          required: helpers.withMessage(
            "Выберите группу деятельности",
            required
          ),
        },
        activityProfile: {
          required: helpers.withMessage(
            "Выберите профиль деятельности",
            required
          ),
        },
        productRanges: {
          required: helpers.withMessage(
            "Выберите наменклатуру товаров",
            required
          ),
        },
      },
    };
  },
  methods: {
    ...mapActions([
      "FETCH_CONSULTANT_LIST",
      "FETCH_COMPANY_GROUP_LIST",
      "CREATE_COMPANY",
      "UPDATE_COMPANY",
    ]),
    onSubmit() {
      this.v$.$validate();
      if (!this.v$.form.$error) {
        console.log(this.form);
        this.loader = true;
        this.normalizeContacts();
        if (this.formdata) {
          this.updateCompany();
        } else {
          this.createCompany();
        }
      }
    },
    async updateCompany() {
      if (await this.UPDATE_COMPANY(this.form)) {
        this.$emit("updated");
        this.clickCloseModal();
      }
      this.loader = false;
    },
    async createCompany() {
      if (await this.CREATE_COMPANY(this.form)) {
        this.$emit("created");
        this.clickCloseModal();
      }
      this.loader = false;
    },
    customRequired(value) {
      if (!this.form.noName) {
        if (value != null) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
  },
  async mounted() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    await this.FETCH_COMPANY_GROUP_LIST();
    if (this.formdata) {
      this.form = { ...this.form, ...this.formdata };
      this.form = Utils.normalizeDataForCompanyForm(this.form);
    }
    this.loader = false;
  },
  watch: {
    form: {
      handler() {
        console.log("FORM: ", this.form);
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>