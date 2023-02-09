<template>
  <CompanyBoxLayout class="CompanyBoxLogs" :class="'grid-b'">
    <template #header>
      <span>Лог работы с {{ headerTitle }}</span>
    </template>
    <template #content>
      <CompanyLogsList
        :logs="this.COMPANY_LOGS"
        :logsCount="this.COMPANY_LOGS_COUNT"
        @infinite="load"
      />
      <Form class="CompanyBoxLogs-form" @submit="onSubmit(this.company.id)">
        <FormGroup>
          <Textarea
            class="CompanyBoxLogs-form-text col-12"
            v-model="form.comment"
            :v="v$.form.comment"
            placeholder="Добавьте комментарий"
          />
          <Submit
            class="CompanyBoxLogs-form-btn mt-1"
            buttonClasses="btn-primary"
          >
            добавить
          </Submit>
          <div class="col-12 mt-4" v-if="loader">
            <Loader class="center small py-2 no-absolute" />
          </div>
        </FormGroup>
      </Form>
    </template>
  </CompanyBoxLayout>
</template>

<script>
import CompanyLogsList from "./logsList/CompanyLogsList.vue";
import { mapGetters, mapActions } from "vuex";
import Textarea from "../../../common/form/Textarea.vue";
import Form from "../../../common/form/Form.vue";
import FormGroup from "../../../common/form/FormGroup.vue";
import Submit from "../../../common/form/Submit.vue";
import CompanyBoxLayout from "../CompanyBoxLayout.vue";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import "./styles.scss";

export default {
  name: "CompanyBoxLogs",
  components: {
    CompanyBoxLayout,
    Submit,
    FormGroup,
    Form,
    Textarea,
    CompanyLogsList,
  },
  props: {
    logs: {
      type: Array,
      default: () => [],
    },
    company: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      form: {
        comment: null,
      },
      loaderMoreLogs: false,
    };
  },

  validations() {
    return {
      form: {
        comment: {
          required: helpers.withMessage("введите комментарий", required),
        },
      },
    };
  },
  computed: {
    ...mapGetters(["THIS_USER", "COMPANY_LOGS", "COMPANY_LOGS_COUNT"]),
    headerTitle() {
      return this.company.nameRu || this.company.nameEng;
    },
  },
  methods: {
    ...mapActions(["POST_COMPANY_LOG", "FETCH_COMPANY_LOGS"]),
    async onSubmit(companyId) {
      this.v$.$validate();
      if (this.v$.form.$error) {
        return;
      }
      this.loader = true;
      const logComment = {
        company_id: companyId,
        user_id: this.THIS_USER.userProfile.user_id,
        message: this.form.comment,
        type: 1,
      };
      let response = await this.POST_COMPANY_LOG(logComment);
      if (response) {
        this.form.comment = null;
        this.v$.$reset();
      }
      this.loader = false;
    },
    async load($state, id = this.company.id) {
      console.log("loading more...");
      try {
        const response = await this.FETCH_COMPANY_LOGS(id);
        if (response === "complete") {
          $state.complete();
        }
        if (response === "loaded") {
          $state.loaded();
        }
      } catch (error) {
        $state.error();
      }
    },
  },
};
</script>