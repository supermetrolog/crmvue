<template>
  <div class="fuck">
    <Modal title="Создание компании" @close="clickCloseModal">
      <Form @submit="onSubmit">
        <Tabs :options="{ useUrlFragment: false }">
          <Loader class="center" v-if="loader" />

          <Tab name="Основное">
            <FormGroup class="mb-1">
              <Checkbox v-model="form.noName" label="Нет" class="col-1 large" />
              <Input
                v-if="!form.noName"
                v-model="form.nameRu"
                :v="v$.form.nameRu"
                :maska="{
                  mask: 'Z*',
                  tokens: { Z: { pattern: /[а-яА-Я0-9 (--)]/ } },
                }"
                :required="!form.nameEng"
                label="Название Ru"
                class="col-6 px-1"
              />
              <Input
                v-if="!form.noName"
                v-model="form.nameEng"
                :v="v$.form.nameEng"
                :maska="{
                  mask: 'Z*',
                  tokens: { Z: { pattern: /[a-zA-Z0-9 (--)]/ } },
                }"
                :required="!form.nameRu"
                label="Название Eng"
                class="col-5 pl-1"
              />
            </FormGroup>
            <FormGroup class="mb-1">
              <Input
                v-model="form.nameBrand"
                :maska="{
                  mask: 'Z*',
                  tokens: { Z: { pattern: /[а-яА-Яa-zA-Z0-9 (--)]/ } },
                }"
                label="Название Brand"
                class="col-5 pr-1"
              />
              <MultiSelect
                v-model="form.companyGroup_id"
                label="Входит в ГК"
                class="col-5 px-1"
                :searchable="true"
                :options="COMPANY_GROUP_LIST"
              />
              <MultiSelect
                v-if="!form.noName"
                v-model="form.formOfOrganization"
                label="ФО"
                title="Форма организации"
                class="col-2 pl-1"
                :options="formOfOrganizationOptions"
              />
            </FormGroup>
            <FormGroup class="mb-1">
              <MultiSelect
                v-model="form.officeAdress"
                :title="form.officeAdress"
                extraClasses="long-text"
                label="Адрес офиса"
                class="col-12 text-center"
                :filterResults="false"
                :minChars="1"
                :resolveOnLoad="formdata ? true : false"
                :delay="0"
                :searchable="true"
                :options="
                  async (query) => {
                    return await getAddress(query);
                  }
                "
              />
            </FormGroup>
            <FormGroup class="mb-1">
              <MultiSelect
                v-model="form.consultant_id"
                :v="v$.form.consultant_id"
                required
                label="Консультант"
                class="col-6 pr-1"
                :options="CONSULTANT_LIST"
              />
              <PropogationInput
                v-model="form.contacts.websites"
                :v="v$.form.contacts.websites"
                label="Вебсайт"
                name="website"
                class="col-6 pl-1"
              />
            </FormGroup>

            <FormGroup class="mb-1">
              <PropogationDoubleInput
                v-model="form.contacts.phones"
                :v="v$.form.contacts.phones"
                :maska="[
                  '+7 (###) ###-##-###',
                  '+### (###) ###-##-##',
                  '+#### (###) ###-##-##',
                ]"
                placeholder="+7 "
                name="phone"
                name2="exten"
                label="Телефон"
                class="col-6"
              />

              <PropogationInput
                v-model="form.contacts.emails"
                :v="v$.form.contacts.emails"
                name="email"
                label="Email"
                class="col-6 pl-1"
              />
            </FormGroup>

            <FormGroup class="mb-1">
              <Checkbox
                v-model="form.categories"
                :v="v$.form.categories"
                :options="categoryOptions"
                required
                name="category"
                label="Категория"
                class="col-12 text-center"
              />
            </FormGroup>
            <FormGroup class="mb-1"> </FormGroup>
            <FormGroup class="mb-1">
              <Checkbox
                v-model="form.processed"
                label="Обработано"
                class="col large text-center"
              />
              <Radio
                v-model="form.status"
                :v="v$.form.status"
                required
                label="Статус"
                class="col pl-1"
                :options="statusOptions"
              />
              <MultiSelect
                v-if="!form.status"
                v-model="form.passive_why"
                :v="v$.form.passive_why"
                required
                label="Причина пассива"
                class="col-4 pl-1"
                :options="passiveWhyOptions"
              >
                <Textarea
                  v-model="form.passive_why_comment"
                  class="col-12 p-0 pt-1"
                />
              </MultiSelect>
              <RadioStars
                v-model="form.rating"
                label="Рейтинг"
                class="col pl-1 text-center ml-auto"
                :options="ratingOptions"
              >
                <p class="text-left pl-5 mt-2">
                  <i class="fas fa-star"></i>
                  - не особо важно
                </p>
                <p class="text-left pl-5">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  - важно
                </p>
                <p class="text-left pl-5">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  - очень важно
                </p>
              </RadioStars>
            </FormGroup>
            <FormGroup class="mb-1">
              <Textarea
                v-model="form.description"
                label="Описание"
                class="col-12 px-0"
              />
            </FormGroup>
          </Tab>
          <Tab name="Деятельность">
            <FormGroup class="mb-1">
              <MultiSelect
                v-model="form.activityGroup"
                :v="v$.form.activityGroup"
                required
                title="Группа деятельности"
                label="Группа дея-ти"
                class="col-6 pr-1"
                :options="activityGroupOptions"
              />
              <MultiSelect
                v-model="form.activityProfile"
                :v="v$.form.activityProfile"
                required
                title="Профиль деятельности"
                label="Профиль дея-ти"
                class="col-6 pl-1"
                :options="activityProfileOptions"
              />
            </FormGroup>
            <FormGroup class="mb-1">
              <MultiSelect
                v-model="form.productRanges"
                mode="tags"
                :closeOnSelect="false"
                :loading="false"
                :searchable="true"
                :createTag="true"
                :resolveOnLoad="true"
                label="Номенклатура товара"
                class="col-10 tags mx-auto text-center"
                :options="
                  async () => {
                    return await getProductRangeList();
                  }
                "
                name="product"
              />
            </FormGroup>
          </Tab>
          <Tab name="Реквизиты">
            <FormGroup class="mb-1">
              <MultiSelect
                v-model="form.legalAddress"
                :title="form.legalAddress"
                label="Юр. адрес"
                class="col-12"
                :filterResults="false"
                :minChars="1"
                :resolveOnLoad="formdata ? true : false"
                :delay="0"
                :searchable="true"
                :options="
                  async (query) => {
                    return await getAddress(query);
                  }
                "
              />
            </FormGroup>
            <FormGroup class="mb-1">
              <Input
                v-model="form.ogrn"
                :v="v$.form.ogrn"
                label="ОГРН"
                class="col-4 pr-1"
                maska="#############"
              />
              <Input
                v-model="form.inn"
                :v="v$.form.inn"
                label="ИНН"
                class="col-4 px-1"
                maska="############"
              />
              <Input
                v-model="form.kpp"
                :v="v$.form.kpp"
                label="КПП"
                class="col-4 pl-1"
                maska="#########"
              />
            </FormGroup>

            <FormGroup class="mb-1">
              <Input
                v-model="form.checkingAccount"
                :v="v$.form.checkingAccount"
                label="Расчетный счет"
                class="col-4 pr-1"
                maska="####################"
              />
              <Input
                v-model="form.correspondentAccount"
                :v="v$.form.correspondentAccount"
                label="Корреспондентский счет"
                class="col-4 px-1"
                maska="####################"
              />
              <Input
                v-model="form.inTheBank"
                label="В банке"
                class="col-4 pl-1"
                :searchable="true"
                :options="COMPANY_IN_THE_BANK_LIST"
              />
            </FormGroup>

            <FormGroup class="mb-1">
              <Input
                v-model="form.bik"
                :v="v$.form.bik"
                label="БИК"
                class="col-4 pr-1"
                maska="#########"
              />
              <Input
                v-model="form.okpo"
                :v="v$.form.okpo"
                label="ОКПО"
                class="col-4 px-1"
                maska="##########"
              />
              <Input
                v-model="form.okved"
                :v="v$.form.okved"
                label="ОКВЭД"
                class="col-4 pl-1"
                maska="##############################"
              />
            </FormGroup>

            <FormGroup class="mb-1">
              <Input
                v-model="form.signatoryName"
                label="Имя подписанта"
                class="col-4 pr-1"
              />
              <Input
                v-model="form.signatoryMiddleName"
                label="Фамилия подписанта"
                class="col-4 px-1"
              />
              <Input
                v-model="form.signatoryLastName"
                label="Отчество подписанта"
                class="col-4 pl-1"
              />
            </FormGroup>
            <FormGroup class="mb-1">
              <Input
                v-model="form.documentNumber"
                label="№ документа"
                maska="#####################"
                class="col-6 pr-1"
              />
              <Input
                v-model="form.basis"
                label="Действует на основе"
                class="col-6 pl-1"
              />
            </FormGroup>
          </Tab>
          <Tab name="Документы">
            <FormGroup class="mb-1">
              <FileInput
                v-model:native="form.fileList"
                v-model:data="form.files"
                label="Документы"
                class="col-12"
              >
                Выбрать файлы
              </FileInput>
            </FormGroup>
          </Tab>
          <FormGroup class="mt-4">
            <Submit class="col-4 mx-auto">
              {{ formdata ? "Сохранить" : "Создать" }}
            </Submit>
          </FormGroup>
        </Tabs>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import Input from "@/components/common/form/Input.vue";
import Submit from "@/components/common/form/Submit.vue";
import Textarea from "@/components/common/form/Textarea.vue";
import FileInput from "@/components/common/form/FileInput.vue";
import PropogationInput from "@/components/common/form/PropogationInput.vue";
import PropogationDoubleInput from "@/components/common/form/PropogationDoubleInput.vue";
import Checkbox from "@/components/common/form/Checkbox.vue";
import Radio from "@/components/common/form/Radio.vue";
import RadioStars from "@/components/common/form/RadioStars.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import useValidate from "@vuelidate/core";
import {
  required,
  helpers,
  minLength,
  maxLength,
  email,
} from "@vuelidate/validators";
import { mapGetters, mapActions } from "vuex";
import {
  CompanyCategories,
  ActivePassive,
  CompanyFormOrganization,
  ActivityGroupList,
  ActivityProfileList,
  PassiveWhy,
  RatingList,
} from "@/const/Const.js";
import Utils, {
  yandexmap,
  validatePropogationInput,
  validateUrl,
} from "@/utils";
import api from "@/api/api";
export default {
  name: "TestForm",
  components: {
    FormGroup,
    Form,
    Input,
    Submit,
    PropogationInput,
    PropogationDoubleInput,
    Textarea,
    Checkbox,
    Radio,
    RadioStars,
    MultiSelect,
    FileInput,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      categoryOptions: CompanyCategories.get("param"),
      formOfOrganizationOptions: CompanyFormOrganization.get("param"),
      statusOptions: ActivePassive.get("param"),
      activityGroupOptions: ActivityGroupList.get("param"),
      activityProfileOptions: ActivityProfileList.get("param"),
      passiveWhyOptions: PassiveWhy.get("param"),
      ratingOptions: RatingList.get("param"),
      form: {
        activityGroup: null,
        activityProfile: null,
        basis: null,
        bik: null,
        categories: [],
        checkingAccount: null,
        companyGroup_id: null,
        consultant_id: null,
        contacts: { phones: [], emails: [], websites: [] },
        correspondentAccount: null,
        description: null,
        documentNumber: null,
        formOfOrganization: null,
        inTheBank: null,
        inn: null,
        kpp: null,
        legalAddress: null,
        nameBrand: null,
        nameEng: null,
        nameRu: null,
        noName: 0,
        officeAdress: null,
        ogrn: null,
        okpo: null,
        okved: null,
        processed: 0,
        productRanges: [],
        signatoryLastName: null,
        signatoryMiddleName: null,
        signatoryName: null,
        status: 1,
        rating: 5,
        passive_why: null,
        passive_why_comment: null,
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
    ...mapGetters([
      "COMPANY",
      "CONSULTANT_LIST",
      "COMPANY_GROUP_LIST",
      "COMPANY_PRODUCT_RANGE_LIST",
      "COMPANY_IN_THE_BANK_LIST",
    ]),
  },
  validations() {
    return {
      form: {
        contacts: {
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
          websites: {
            propogation: helpers.withMessage(
              "Пустое поле не допустимо",
              this.validateWebsitesPropogation
            ),
            website: helpers.withMessage(
              "заполните вебсайт правильно",
              this.customUrlValidation
            ),
          },
          phones: {
            propogation: helpers.withMessage(
              "Пустое поле не допустимо",
              this.validatePhonesPropogation
            ),
          },
        },
        nameEng: {
          customRequiredName: helpers.withMessage(
            "заполните поле",
            this.customRequiredNameEng
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
          customRequiredName: helpers.withMessage(
            "заполните поле",
            this.customRequiredNameRu
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
            "инн не может быть меньше 10 символов",
            minLength(10)
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
        passive_why: {
          customRequiredPassiveWhy: helpers.withMessage(
            "Выберите причину",
            this.customRequiredPassiveWhy
          ),
        },
      },
    };
  },
  methods: {
    ...mapActions([
      "FETCH_CONSULTANT_LIST",
      "FETCH_COMPANY_GROUP_LIST",
      "FETCH_COMPANY_PRODUCT_RANGE_LIST",
      "FETCH_COMPANY_IN_THE_BANK_LIST",
      "CREATE_COMPANY",
      "UPDATE_COMPANY",
    ]),
    onSubmit() {
      this.v$.$validate();
      console.error(email.$validator("fuck@suck.ru"));
      if (!this.v$.form.$error) {
        this.loader = true;
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
    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
    async getAddress(query) {
      if (this.formdata)
        return await yandexmap.getAddress(query, this.formdata.officeAdress);
      return await yandexmap.getAddress(query);
    },
    validateEmailsPropogation() {
      return validatePropogationInput(this.form.contacts.emails, "email");
    },
    validateWebsitesPropogation() {
      return validatePropogationInput(this.form.contacts.websites, "website");
    },
    validatePhonesPropogation() {
      return validatePropogationInput(this.form.contacts.phones, "phone");
    },
    customEmailValidation() {
      let flag = true;
      this.form.contacts.emails.forEach((item) => {
        if (!email.$validator(item.email)) {
          flag = false;
        }
      });
      return flag;
    },
    customUrlValidation() {
      let flag = true;
      this.form.contacts.websites.forEach((item) => {
        if (!validateUrl(item.website)) {
          flag = false;
        }
      });
      return flag;
    },
    customRequiredNameRu(value) {
      if (!this.form.noName) {
        if (
          (value != null && value != "") ||
          (this.form.nameEng != null && this.form.nameEng != "")
        ) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    customRequiredNameEng(value) {
      if (!this.form.noName) {
        if (
          (value != null && value != "") ||
          (this.form.nameRu != null && this.form.nameRu != "")
        ) {
          return true;
        }
        return false;
      } else {
        return true;
      }
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
    async getProductRangeList() {
      return await api.companies.getCompanyProductRangeList();
    },
  },
  async mounted() {
    this.loader = true;
    await Promise.all([
      this.FETCH_CONSULTANT_LIST(),
      this.FETCH_COMPANY_GROUP_LIST(),
      this.FETCH_COMPANY_PRODUCT_RANGE_LIST(),
      this.FETCH_COMPANY_IN_THE_BANK_LIST(),
    ]);
    if (this.formdata) {
      const cloneFormdata = JSON.stringify(this.formdata);
      this.form = { ...this.form, ...JSON.parse(cloneFormdata) };

      this.form = Utils.normalizeDataForCompanyForm(this.form);
    }
    this.loader = false;
  },
  watch: {
    form: {
      handler() {
        console.log("FORM: ", this.form.contacts.phones);
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>