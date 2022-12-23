<template>
  <div class="fuck">
    <Modal :title="'Контакт'" @close="clickCloseModal" class="normal">
      <div class="CompanyContactModal">
        <div class="CompanyContactModal-left">
          <p class="CompanyContactModal-left-name">
            {{ contact.full_name ? contact.full_name : "Общий контакт" }}
          </p>

          <div v-if="contact.phones">
            <PhoneNumber
              v-for="phone of contact.phones"
              :key="phone"
              class="CompanyBoxContactListItem-phone"
              :phone="phone"
              :contact="contact"
            />
          </div>
          <div>
            <a
              :href="'mailto:' + email.email"
              class="d-block"
              v-for="email in contact.emails"
              :key="email.id"
            >
              {{ email.email }}
            </a>
          </div>
          <div class="CompanyContactModal-left-icons">
            <i
              class="fas fa-exclamation-circle mr-2 text-danger"
              v-if="contact.warning"
              title="Внимание"
            ></i>
            <i
              class="fas fa-smile mr-2 text-success"
              v-if="contact.good"
              title="Хорошие взаимоотношения"
            ></i>
            <i
              class="fas fa-street-view mr-2 text-dark"
              v-if="contact.faceToFaceMeeting"
              title="Очная встреча"
            ></i>
            <i
              class="fas fa-pen text-primary edit"
              @click="this.$emit('clickEditContact', this.contact)"
              v-if="!contact.type && !reedOnly"
            ></i>
          </div>
          <div>
            <div class="way-list">
              <i
                class="px-1 text-info"
                :title="getWayTitle(way.way)"
                :class="getWayClass(way.way)"
                v-for="way of contact.wayOfInformings"
                :key="way.id"
              ></i>
            </div>
          </div>
          <div>
            <span v-if="!contact.position_unknown">{{ position }}</span>
            <span v-if="contact.position_unknown">Должость неизвестна</span>
          </div>

          <div>
            <span
              >{{ contact.good }} {{ contact.faceToFaceMeeting }}
              {{ contact.warning }} {{ contact.warning_why_comment }}</span
            >
          </div>
          <div>
            <span>компания {{ contact.company_id }}</span>
          </div>
          <div>
            <span>{{ contact.status }}</span>
          </div>
          <div>
            <span>{{ contact.passive_why_comment }}</span>
          </div>
          <div>
            <span>{{ contact.isMain }}</span>
          </div>
          <div>
            <span v-if="contact.websites"
              ><a
                :href="`http://${website}`"
                target="_blank"
                rel="noopener noreferrer"
                :title="website"
                v-for="website in contact.websites"
                :key="website"
                >{{ website }}</a
              ></span
            >
          </div>
        </div>
        <div class="CompanyContactModal-right">
          <div
            class="col-12 comment-list text-left"
            v-if="contact.contactComments.length"
          >
            <div
              class="comment"
              v-for="comment in contact.contactComments"
              :key="comment.id"
            >
              <strong>{{ comment.author.userProfile.short_name }}</strong>
              <p>{{ comment.comment }}</p>
              <small class="text-grey">{{ comment.created_at }}</small>
            </div>
          </div>
          <div class="col-12 mt-2">
            <textarea v-model="comment"></textarea>
            <button
              class="btn btn-primary btn-large"
              @click="clickCreateComment"
            >
              Отправить
            </button>
          </div>
        </div>

        <div class="CompanyContactModal-footer">
          <hr />
          <span v-if="contact.consultant?.userProfile.short_name">{{
            contact.consultant.userProfile.short_name
          }}</span>
          <span v-else>хз</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import PhoneNumber from "../../../common/PhoneNumber.vue";
import { mapGetters, mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import {
  FeedbackList,
  PositionList,
  ActivePassive,
  PassiveWhyContact,
} from "@/const/Const.js";
// import Form from "@/components/common/form/Form.vue";
// import FormGroup from "@/components/common/form/FormGroup.vue";
// import Input from "@/components/common/form/Input.vue";
// import Submit from "@/components/common/form/Submit.vue";
// import PropogationInput from "@/components/common/form/PropogationInput.vue";
// import PropogationDoubleInput from "@/components/common/form/PropogationDoubleInput.vue";
// import Checkbox from "@/components/common/form/Checkbox.vue";
// import Textarea from "@/components/common/form/Textarea.vue";
// import Radio from "@/components/common/form/Radio.vue";
// import MultiSelect from "@/components/common/form/MultiSelect.vue";
import api from "@/api/api";

export default {
  name: "CompanyContactModal",
  components: {
    PhoneNumber,
  },
  data() {
    return {
      v$: useValidate(),
      wayOfInformings: FeedbackList.get("contact"),
      positionList: PositionList.get("param"),
      statusOptions: ActivePassive.get("param"),
      passiveWhyOptions: PassiveWhyContact.get("param"),
      loader: false,
      selectedCompany: null,
    };
  },
  inject: ["createContactComment"],
  props: {
    contact: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["CONSULTANT_LIST"]),
    position() {
      return this.positionList[this.contact.position]?.label;
    },
  },
  methods: {
    ...mapActions(["FETCH_CONSULTANT_LIST", "SEARCH_COMPANIES"]),
    getWayClass(way) {
      return this.wayOfInformings[way][2];
    },
    getWayTitle(way) {
      return this.wayOfInformings[way][1];
    },
    async updateContact() {
      if (await this.UPDATE_CONTACT(this.form)) {
        this.$emit("updated");
        this.clickCloseModal();
      }
      this.loader = false;
    },
    clickCreateComment() {
      let data = {
        contact_id: this.contact.id,
        comment: this.comment,
      };
      this.comment = null;
      this.createContactComment(data);
    },
    async searchCompany(query) {
      let result = null;
      let array = [];
      if (this.formdata || this.company_id) {
        if (!this.selectedCompany) {
          this.selectedCompany = await api.companies.getCompany(
            this.formdata ? this.formdata.company_id : this.company_id
          );
        }

        array.push({
          value: this.selectedCompany.id,
          label: this.selectedCompany.full_name,
        });
      }
      query = {
        all: query,
      };
      result = await api.companies.searchCompanies(query);
      console.log("RES", result);
      result.data.forEach((item) => {
        array.push({ value: item.id, label: item.full_name });
      });
      return array;
    },

    clickCloseModal() {
      this.$emit("closeContactModal");
    },
  },
  async mounted() {
    this.loader = true;
    await this.FETCH_CONSULTANT_LIST();
    this.form.company_id = this.company_id;
    this.form.phones = this.phones;
    if (this.formdata) {
      this.form = { ...this.form, ...this.formdata };
    }
    this.loader = false;
  },
  watch: {
    form: {
      handler() {
        console.log("FORM: ", this.form);
      },
      deep: true,
    },
  },
  emits: ["closeCompanyForm"],
};
</script>

<style>
</style>