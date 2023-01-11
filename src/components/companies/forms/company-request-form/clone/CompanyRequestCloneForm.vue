<template>
  <div class="company-request-clone-form">
    <div class="row no-gutters">
      <div class="col-12 text-center">
        <Form class="autosize" @submit="onSubmit">
          <Loader class="center" v-if="loader" />
          <FormGroup>
            <MultiSelect
              v-model="form.consultant_id"
              :v="v$.form.consultant_id"
              required
              label="Консультант"
              class="col-6 text-center mx-auto"
              :options="CONSULTANT_LIST"
            />
            <div class="col-12 text-center mt-4">
              <CompanyBoxRequestsListItem :request="request" :reedOnly="true" />
            </div>
            <Submit class="col-4 mt-2 mx-auto" buttonClasses="btn-success">
              Клонировать
            </Submit>
          </FormGroup>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyBoxRequestsListItem from "@/components/companies/company-boxes/requests/CompanyBoxRequestsListItem.vue";
import Mixin from "./mixin";
import Form from "@/components/common/form/Form";
import FormGroup from "@/components/common/form/FormGroup";
import MultiSelect from "@/components/common/form/MultiSelect";
import Submit from "@/components/common/form/Submit";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "CompanyRequestCloneForm",
  mixins: [Mixin],
  components: {
    CompanyBoxRequestsListItem,
    Form,
    FormGroup,
    MultiSelect,
    Submit,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      form: {
        consultant_id: null,
      },
    };
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
      },
    };
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST", "CREATE_REQUEST"]),
    async onSubmit() {
      this.v$.$validate();
      if (this.v$.form.$error) {
        return;
      }

      this.loader = true;
      const request = {
        ...this.request,
        consultant_id: this.form.consultant_id,
      };
      delete request.id;
      delete request.created_at;
      delete request.updated_at;
      request.status = 1;
      if (await this.CREATE_REQUEST(request)) {
        this.$emit("cloned");
      }
      this.loader = false;
    },
  },

  async created() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    this.loader = false;
  },
};
</script>

<style>
</style>