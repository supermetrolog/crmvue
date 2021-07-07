<template>
  <div class="company-form">
    <form @submit.prevent="submitForm">
      <Modal title="Создание компании" @close="clickCloseModal">
        <div class="company-form-container">
          <Tabs
            :invalidIndex="getInvalidTabsList"
            :options="{ useUrlFragment: false }"
          >
            <Tab name="Основное">
              <MainInputList :v="this.v$.FORM" />
            </Tab>
            <Tab name="Деятельность">
              <ActivityInputList :v="this.v$.FORM" />
            </Tab>
            <Tab name="Реквизиты">
              <RequisistesInputList :v="this.v$.FORM" />
            </Tab>
          </Tabs>
          <div class="row mb-4">
            <div class="col-5 text-center m-auto">
              <input
                class="btn btn-success btn-large"
                type="submit"
                value="Создать"
              />
            </div>
          </div>
        </div>
      </Modal>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import MainInputList from "./MainInputList.vue";
import RequisistesInputList from "./RequisistesInputList.vue";
import ActivityInputList from "./ActivityInputList.vue";
import Modal from "@/components/Modal";
export default {
  name: "CompanyForm",
  components: {
    Modal,
    MainInputList,
    RequisistesInputList,
    ActivityInputList,
  },
  data() {
    return {
      v$: useValidate(),
    };
  },
  computed: {
    ...mapGetters(["FORM"]),
    getInvalidTabsList() {
      let array = [];
      if (this.v$.FORM.$error) array.push(0);
      if (this.v$.FORM.$error) array.push(2);
      if (this.v$.FORM.$error) array.push(1);
      return array;
    },
  },
  validations() {
    return {
      FORM: {
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
        category: {
          required: helpers.withMessage("выберите категорию", required),
        },
        status: {
          required: helpers.withMessage("Выберите статус", required),
        },
        consultant: {
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
        productRange: {
          required: helpers.withMessage(
            "Выберите наменклатуру товаров",
            required
          ),
        },
      },
    };
  },
  methods: {
    submitForm() {
      this.v$.$validate();
      console.log(this.v$.FORM.$error);
    },
    customRequired(value) {
      if (!this.FORM.noName) {
        if (value != "") {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    clickCloseModal() {
      this.$emit("closeCompanyFormInline");
    },
  },
  emits: ["closeCompanyFormInline"],
};
</script>

<style>
</style>