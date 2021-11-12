<template>
  <div class="company-form">
    <form @submit.prevent="submitForm">
      <Modal title="Создание компании" @close="clickCloseModal">
        <div class="company-form-container">
          <Tabs
            :invalidIndex="getInvalidTabsList"
            :options="{ useUrlFragment: false }"
          >
            <Loader class="center" v-if="loader" />

            <Tab name="Основное">
              <MainInputList
                :v="v$.form"
                :formdata="form"
                @addProductRangeItem="addProductRangeItem"
                @deleteProductRangeItem="deleteProductRangeItem"
              />
            </Tab>
            <Tab name="Реквизиты">
              <RequisistesInputList :v="v$.form" :formdata="form" />
            </Tab>
          </Tabs>
          <div class="row mb-3 mt-0">
            <div class="col-5 text-center m-auto">
              <input
                v-if="!formdata"
                class="btn btn-success btn-large"
                type="submit"
                value="Создать"
              />
              <input
                v-else
                class="btn btn-success btn-large"
                type="submit"
                value="Сохранить изменения"
              />
            </div>
          </div>
        </div>
      </Modal>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import MainInputList from "./MainInputList.vue";
import RequisistesInputList from "./RequisistesInputList.vue";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Utils from "@/utils";
export default {
  name: "CompanyForm",
  components: {
    Modal,
    MainInputList,
    RequisistesInputList,
    Loader,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
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
    ...mapGetters(["COMPANY"]),
    getInvalidTabsList() {
      let array = [];
      if (this.v$.form.$error) array.push(0);
      if (this.v$.form.$error) array.push(2);
      if (this.v$.form.$error) array.push(1);
      return array;
    },
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
    submitForm() {
      // this.createCompany();
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
    normalizeContacts() {
      this.form.contacts.phones = this.form.contacts.phones.filter(
        (item) => item != ""
      );
      this.form.contacts.emails = this.form.contacts.emails.filter(
        (item) => item != ""
      );
      this.form.contacts.websites = this.form.contacts.websites.filter(
        (item) => item != ""
      );
    },
    addProductRangeItem(newItem) {
      this.form.productRanges.push(newItem);
    },
    deleteProductRangeItem(index) {
      this.form.productRanges = this.form.productRanges.filter(
        (item, idx) => idx != index
      );
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
    clickCloseModal() {
      this.$emit("closeCompanyForm");
    },
  },
  async mounted() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    await this.FETCH_COMPANY_GROUP_LIST();
    if (this.formdata) {
      let clone = JSON.parse(JSON.stringify(this.formdata));
      this.form = Utils.normalizeDataForCompanyForm(clone);
      this.form.fileList = [];
    }
    this.loader = false;
  },
  emits: ["closeCompanyForm", "created", "updated"],
};
</script>

<style>
</style>