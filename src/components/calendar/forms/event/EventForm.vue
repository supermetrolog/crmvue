<template>
  <div class="notification-form">
    <Form @submit="onSubmit" class="autosize">
      <Loader class="center" v-if="loader" />
      <FormGroup class="mb-2">
        <Input
          class="col-12"
          v-model="form.title"
          label="Название"
          :v="v$.form.title"
        />
        <Input
          class="col-12"
          v-model="form.startDate"
          :v="v$.form.startDate"
          type="datetime-local"
          label="Начало события"
        />
        <Input
          class="col-12"
          v-model="form.endDate"
          type="datetime-local"
          label="Конец события"
        />
      </FormGroup>
      <FormGroup>
        <button class="btn btn-success">Создать</button>
      </FormGroup>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form";
import FormGroup from "@/components/common/form/FormGroup";
import Input from "@/components/common/form/Input";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { mapActions } from "vuex";
export default {
  name: "EventForm",
  components: {
    Form,
    FormGroup,
    Input,
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      form: {
        title: null,
        startDate: null,
        endDate: null,
        consultant_id: null,
      },
    };
  },
  validations() {
    return {
      form: {
        title: {
          required: helpers.withMessage("Заполните название", required),
        },
        startDate: {
          required: helpers.withMessage(
            "Выберите дату начала события",
            required
          ),
        },
      },
    };
  },
  props: {
    formdata: {
      type: Object,
    },
    forUpdate: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(["CREATE_CALENDAR_EVENT", "UPDATE_CALENDAR_EVENT"]),
    async onSubmit() {
      this.v$.$validate();
      if (!this.v$.form.$error) {
        this.loader = true;
        if (this.forUpdate) {
          await this.update();
        } else {
          await this.create();
        }
        this.loader = false;
      }
    },

    async create() {
      if (await this.CREATE_CALENDAR_EVENT(this.form)) {
        this.$emit("created", this.form);
      }
    },
    async update() {
      if (await this.UPDATE_CALENDAR_EVENT(this.form)) {
        this.$emit("updated", this.form);
      }
    },
  },
  mounted() {
    if (this.formdata) {
      this.form = { ...this.form, ...this.formdata };
    }
  },
};
</script>

<style>
</style>