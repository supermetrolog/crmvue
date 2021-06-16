<template>
  <div class="company-form">
    <form @submit.prevent="submitForm">
      <Tabs>
        <Tab name="FIRST"><MainInputList :v="this.v$.FORM.main" /></Tab>
        <Tab name="SECOND"> Second Tab content </Tab>
        <Tab name="THIRD"> Third Tab content </Tab>
      </Tabs>

      <input class="btn btn-success" type="submit" value="Создать" />
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import useValidate from "@vuelidate/core";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import MainInputList from "./MainInputList.vue";
export default {
  name: "CompanyForm",
  components: {
    MainInputList,
  },
  data() {
    return {
      v$: useValidate(),
    };
  },
  computed: {
    ...mapGetters(["FORM"]),
  },
  validations() {
    return {
      FORM: {
        main: {
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
        },
      },
    };
  },
  methods: {
    submitForm() {
      this.v$.$touch();
      console.log(this.FORM);
    },
    customRequired(value) {
      if (!this.FORM.main.noName) {
        if (value != "") {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style>
</style>