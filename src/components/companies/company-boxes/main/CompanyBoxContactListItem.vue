<template>
  <div
    @click="this.$emit('openContactFormForUpdate', contact)"
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
    <strong
      class="CompanyBoxContactListItem-name"
      :title="contact.full_name || ''"
      >{{ contact.full_name || "Имя неизвестно" }}</strong
    >
    <span class="CompanyBoxContactListItem-position">{{
      position || "Должность неизвестна"
    }}</span>
    <!-- <PhoneNumber
      v-for="phone of contact.phones"
      class="CompanyBoxContactListItem-phone"
      :key="phone.id"
      :phone="phone"
      :contact="contact"
    /> -->
    <PhoneNumber
      v-if="contact.phones[0]"
      class="CompanyBoxContactListItem-phone"
      :phone="contact.phones[0]"
      :contact="contact"
    />
    <div class="CompanyBoxContactListItem-email">
      <a
        :href="'mailto:' + email.email"
        class="d-block"
        v-for="email in contact.emails"
        :key="email.id"
      >
        {{ email.email }}
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
  },
};
</script>