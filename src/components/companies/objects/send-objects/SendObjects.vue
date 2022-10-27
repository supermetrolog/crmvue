<template>
  <div class="send-objects">
    <div class="row no-gutters">
      <div class="col-12">
        <Form class="autosize" @submit="onSubmit">
          <Loader class="center" v-if="loader" />
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
                {{ selectedContacts.join(", ") }}
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
          <FormGroup class="mb-2 pb-5" v-if="!alreadySended">
            <VueEditor
              class="col-12"
              :editorToolbar="customToolbar"
              v-model="form.message"
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
import Input from "@/components/common/form/Input.vue";
import { VueEditor } from "vue3-editor";
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
    Input,
    CheckboxIcons,
    VueEditor,
  },
  props: {
    alreadySended: {
      type: Boolean,
      default: false,
    },
    formdata: {
      type: Object,
    },
    loader: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      v$: useValidate(),
      wayOfSendingOptions: WayOfSending.get("param"),
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ["clean"], // remove formatting button
      ],
      form: {
        contacts: {
          emails: [],
          phones: [],
        },
        contactForSendMessage: [],
        wayOfSending: [],
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
    selectedContacts() {
      let array = [];
      this.form.contactForSendMessage.forEach((id) => {
        this.companyContacts.find((group) => {
          group.options.find((contact) => {
            if (contact.value == id) {
              array.push(contact.label);
              return true;
            }
            return false;
          });
        });
      });

      return array;
    },
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

      this.normalizeContacts();
      if (this.alreadySended) {
        this.form.message = null;
        this.form.subject = null;
        this.$emit("alreadySent", this.form);
      } else {
        this.$emit("send", this.form);
      }
    },
    normalizeContacts() {
      for (const contact of this.COMPANY_CONTACTS) {
        for (const email of contact.emails) {
          if (
            this.form.contactForSendMessage.find((item) => item == email.email)
          ) {
            this.form.contacts.emails.push(email.id);
            break;
          }
        }
        for (const phone of contact.phones) {
          if (
            this.form.contactForSendMessage.find((item) => item == phone.phone)
          ) {
            this.form.contacts.phones.push(phone.id);
            break;
          }
        }
      }
      console.error(this.form.contacts);
    },
  },
  mounted() {
    this.form = { ...this.form, ...this.formdata };
  },
};
</script>

<style>
</style>