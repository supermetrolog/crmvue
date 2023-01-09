<template>
  <div
    @click="clickContact"
    class="CompanyBoxContactListItem"
    :class="{
      'CompanyBoxContactListItem-is_main': contact.isMain,
      'CompanyBoxContactListItem-good': !!contact.good,
    }"
  >
    <div
      class="CompanyBoxContactListItem-status text-danger"
      v-if="!!contact.warning"
    >
      <span>ВНИМАНИЕ!!!</span>
    </div>
    <i
      class="fas fa-street-view mr-2 text-dark CompanyBoxContactListItem-status"
      v-if="contact.faceToFaceMeeting"
      title="Очная встреча"
    ></i>
    <strong
      class="CompanyBoxContactListItem-name"
      :title="contact.full_name || ''"
      v-if="!contact.type"
      >{{ contact.full_name || "Имя неизвестно" }}</strong
    >
    <strong v-if="contact.type" class="CompanyBoxContactListItem-name"
      >Общий контакт</strong
    >
    <span class="CompanyBoxContactListItem-position">{{
      contact.position_unknown ? "Должность неизвестна" : position
    }}</span>
    <PhoneNumber
      v-if="contact.phones.length"
      class="CompanyBoxContactListItem-phone"
      :phone="mainPhone || contact.phones[0]"
      :contact="contact"
    />
    <div class="CompanyBoxContactListItem-email" v-if="contact.emails.length">
      <a :href="'mailto:' + mainMail" class="d-block">
        {{ mainMail }}
      </a>
    </div>
    <hr />
    <div class="CompanyBoxContactListItem-consultant" v-if="contact.consultant">
      <span>
        конс: {{ contact.consultant.userProfile.short_name }}
        <template v-if="updateDate">{{ updateDate }}</template>
      </span>
    </div>
  </div>
</template>

<script>
import PhoneNumber from "../../../common/PhoneNumber.vue";
import { PositionList } from "@/const/Const.js";
import moment from "moment";
export default {
  components: { PhoneNumber },
  name: "CompanyBoxContactListItem",
  props: {
    contact: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      positionList: PositionList.get("param"),
    };
  },
  inject: ["openContact"],
  computed: {
    position() {
      return this.positionList[this.contact.position]?.label;
    },
    updateDate() {
      let date = this.contact.updated_at
        ? this.contact.updated_at
        : this.contact.created_at;
      if (!date) {
        return false;
      }
      return moment(date).format("DD.MM.YYYY");
    },
    mainPhone() {
      return this.contact.phones.find((phone) => phone.isMain);
    },
    mainMail() {
      let mainMail = this.contact.emails.find((email) => email.isMain);
      if (mainMail) {
        return mainMail.email;
      } else {
        return this.contact.emails[0].email;
      }
    },
  },
  methods: {
    clickContact() {
      this.openContact(this.contact);
    },
  },
};
</script>