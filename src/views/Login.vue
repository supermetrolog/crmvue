<template>
  <div class="login">
    <div class="header">
      <div class="row no-gutters mb-4">
        <div class="col-12 logo">
          <img src="@/assets/image/pl-logo.png" alt="PENNY LANE REALTY" />
        </div>
      </div>
      <div class="row no-gutters">
        <div class="col-12 text-center title">
          <h3>Аутентификация</h3>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="row no-gutters">
        <div class="col-12">
          <form @submit.prevent="submitForm" class="company-form">
            <Loader v-if="loader" />
            <div class="row">
              <div class="col-12 input-group">
                <label>логин</label>
                <input
                  :class="{
                    invalid: v$.form.username.$error,
                    valid: v$.form.username.$dirty && !v$.form.username.$error,
                  }"
                  type="text"
                  @input="v$.form.username.$touch"
                  v-model.trim="form.username"
                />
                <div
                  class="col-12 text-center error-container pb-0"
                  v-if="v$.form.username.$error"
                >
                  <span>{{ v$.form.username.$errors[0].$message }}</span>
                </div>
                <label>пароль</label>
                <input
                  :class="{
                    invalid: v$.form.password.$error,
                    valid: v$.form.password.$dirty && !v$.form.password.$error,
                  }"
                  type="password"
                  @input="v$.form.password.$touch"
                  v-model.trim="form.password"
                />
                <div
                  class="col-12 text-center error-container pb-0"
                  v-if="v$.form.password.$error"
                >
                  <span>{{ v$.form.password.$errors[0].$message }}</span>
                </div>
              </div>
              <div class="col-12 mt-2">
                <button class="btn btn-dark btn-large" :disabled="loader">
                  Войти
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useValidate from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";
import Loader from "@/components/Loader.vue";
export default {
  name: "Login",
  components: {
    Loader,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      form: {
        username: "aasdadwa",
        // username: "aas",
        password: "sawdawdsawdawd",
        // password: "sawdawdsawdaw",
      },
    };
  },
  validations() {
    return {
      form: {
        username: {
          required: helpers.withMessage("заполните логин", required),
          minLength: helpers.withMessage(
            "логин не может быть меньше 4 символов",
            minLength(4)
          ),
        },
        password: {
          required: helpers.withMessage("заполните пароль", required),
          minLength: helpers.withMessage(
            "пароль не может быть меньше 8 символов",
            minLength(4)
          ),
        },
      },
    };
  },
  methods: {
    async submitForm() {
      this.v$.$validate();
      if (!this.v$.form.$error) {
        this.loader = true;
        const response = await this.$store.dispatch("LOGIN", this.form);
        if (response !== false) {
          this.$store.dispatch("SET_USER");
          this.axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${this.$store.getters.THIS_USER.access_token}`;
          this.$store.dispatch("WEBSOCKET_RUN");
          this.$router.push("/");
        }
        this.loader = false;
      }
    },
  },
};
</script>

<style>
</style>