<template>
  <div
    class="CompanyBoxContactListItem"
    :class="{
      'CompanyBoxContactListItem-is_main': contact.isMain,
      'CompanyBoxContactListItem-good': !contact.good,
    }"
  >
    <div
      class="CompanyBoxContactListItem-status text-danger"
      v-if="!contact.warning"
    >
      <span>ВНИМАНИЕ!!!</span>
    </div>
    <strong class="CompanyBoxContactListItem-name">{{
      contact.full_name || "Имя неизвестно"
    }}</strong>
    <span class="CompanyBoxContactListItem-position">{{
      position || "Должность неизвестна"
    }}</span>
    <PhoneNumber
      v-for="phone of contact.phones"
      class="CompanyBoxContactListItem-phone"
      :key="phone.id"
      :phone="phone"
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
    <div class="CompanyBoxContactListItem-actions">
      <span>Показать доп контакты (2)</span>
    </div>
    <hr />
    <div class="CompanyBoxContactListItem-consultant" v-if="contact.consultant">
      <span>
        конс: {{ contact.consultant.userProfile.short_name }}
        {{ updateDate }}
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
      return moment(this.contact.updated_at).format("DD.MM.YYYY");
    },
  },
};
</script>