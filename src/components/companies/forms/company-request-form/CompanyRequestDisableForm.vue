<template>
  <Form class="autosize" @submit="onSubmit">
    <Loader class="center" v-if="loader" />
    <FormGroup>
      <MultiSelect
        v-model="form.passive_why"
        :v="v$.form.passive_why"
        required
        label="Причина"
        class="col-12"
        :options="passiveWhyOptions"
      />
      <Textarea
        v-model="form.passive_why_comment"
        label="Комментарий"
        class="col-12"
      />
      <Submit class="col-12 mt-2" buttonClasses="btn-danger">
        Завершить
      </Submit>
    </FormGroup>
  </Form>
</template>

<script>
import Form from "@/components/common/form/Form";
import FormGroup from "@/components/common/form/FormGroup";
import Textarea from "@/components/common/form/Textarea";
import MultiSelect from "@/components/common/form/MultiSelect";
import Submit from "@/components/common/form/Submit";
import useValidate from "@vuelidate/core";
import { PassiveWhyRequest } from "@/const/Const";
import { required, helpers } from "@vuelidate/validators";
import api from "@/api/api";
export default {
  name: "CompanyRequestDisableForm",
  components: {
    Form,
    FormGroup,
    Textarea,
    MultiSelect,
    Submit,
  },
  data() {
    return {
      v$: useValidate(),
      passiveWhyOptions: PassiveWhyRequest.get("param"),
      loader: false,
      form: {
        passive_why: null,
        passive_why_comment: null,
      },
    };
  },
  props: {
    request_id: {
      type: Number,
      required: true,
    },
  },
  validations() {
    return {
      form: {
        passive_why: {
          required: helpers.withMessage("выберите причину", required),
        },
      },
    };
  },
  methods: {
    async onSubmit() {
      this.v$.$validate();
      if (this.v$.form.$error) {
        return;
      }

      this.loader = true;
      if (await api.request.disable(this.request_id, this.form))
        this.$emit("disabled", this.form);
      this.loader = false;
    },
  },
};
</script>

<style>
</style>