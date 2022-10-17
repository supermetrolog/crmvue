<template>
  <div class="send-objects">
    <div class="row no-gutters">
      <div class="col-12">
        <Form class="autosize" @submit="onSubmit">
          <FormGroup class="mb-2">
            <div class="col-2">
              <button class="btn btn-primary">Отправить</button>
            </div>
            <MultiSelect
              :withoutLabel="true"
              required
              :v="v$.form.contactForSendMessage"
              v-model="form.contactForSendMessage"
              :options="companyContacts"
              :clearOnSelect="true"
              :closeOnSelect="false"
              :hideSelected="false"
              :groups="true"
              class="col-4"
              :multipleLabel="
                (n) => {
                  return `${n.length} ${
                    n.length == 1 ? 'контакт выбран' : 'контакта выбрано'
                  }`;
                }
              "
              placeholder="Выберите контакт"
              mode="multiple"
            >
              <div class="col-12 align-self-center">
                {{ form.contactForSendMessage.join(", ") }}
              </div>
            </MultiSelect>
            <CheckboxIcons
              v-if="alreadySended"
              v-model="form.wayOfSending"
              :v="v$.form.wayOfSending"
              required
              label="Способ связи"
              class="text-center col-3"
              :options="wayOfSendingOptions"
            />
          </FormGroup>
          <FormGroup class="mb-2" v-if="!alreadySended">
            <Input
              v-model="form.subject"
              class="col-12"
              placeholder="Тема письма"
            />
          </FormGroup>
          <FormGroup class="mb-2" v-if="!alreadySended">
            <Textarea
              v-model="form.message"
              class="col-12"
              placeholder="Текст письма"
            />
          </FormGroup>
        </Form>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-12">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "@/components/common/form/Form.vue";
import FormGroup from "@/components/common/form/FormGroup.vue";
import MultiSelect from "@/components/common/form/MultiSelect.vue";
import CheckboxIcons from "@/components/common/form/CheckboxIcons.vue";
import Textarea from "@/components/common/form/Textarea.vue";
import Input from "@/components/common/form/Input.vue";
import { mapGetters } from "vuex";
import { WayOfSending } from "@/const/Const.js";
import Utils from "@/utils";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
export default {
  name: "SendObjects",
  components: {
    MultiSelect,
    Form,
    FormGroup,
    Textarea,
    Input,
    CheckboxIcons,
  },
  props: {
    alreadySended: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      v$: useValidate(),
      loader: false,
      wayOfSendingOptions: WayOfSending.get("param"),
      form: {
        contactForSendMessage: [],
        wayOfSending: [0],
        message: null,
        subject: null,
      },
    };
  },
  validations() {
    return {
      form: {
        contactForSendMessage: {
          required: helpers.withMessage("выберите контакт", required),
        },
        wayOfSending: {
          required: helpers.withMessage("выберите способ отправки", required),
        },
      },
    };
  },
  computed: {
    ...mapGetters(["COMPANY_CONTACTS"]),
    companyContacts() {
      if (this.alreadySended)
        return Utils.normalizeContactsForMultiselect(this.COMPANY_CONTACTS);
      return Utils.normalizeContactsForMultiselectOnlyEmails(
        this.COMPANY_CONTACTS
      );
    },
  },

  methods: {
    onSubmit() {
      this.v$.$validate();
      if (this.v$.form.$error) return;
      if (this.alreadySended) {
        this.$emit("alreadySent", this.form);
      } else {
        this.$emit("send", this.form);
      }
    },
  },
};
</script>

<style>
</style>