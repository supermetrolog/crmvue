<template>
  <div class="LetterView">
    <div class="LetterView-header">
      <div class="emails">
        <span>кому: </span>
        <a
          :href="`mailto:${email}`"
          v-for="(email, idx) in emails"
          :key="`${email}_${idx}`"
          >{{ email
          }}<span v-if="emails.length > 1 && idx !== emails.length - 1"
            >,
          </span></a
        >
      </div>
      <div class="from">от: {{ letter.user.email || "sklad@realtor.ru" }}</div>
      <div class="date">{{ dateHandler }}</div>
      <hr />
    </div>
    <div class="LetterView-body">
      <div v-html="letter.body"></div>
    </div>
    <CompanyObjectItemOffer
      v-for="offer in offers"
      :key="offer.id"
      :offer="offer"
      class="main"
    />
    <!-- <span v-for="offer in offers" :key="offer.id">{{ offer.id }}</span> -->
  </div>
</template>

<script>
import CompanyObjectItemOffer from "../../companies/objects/company-objects/CompanyObjectItemOffer.vue";
import moment from "moment";

export default {
  components: { CompanyObjectItemOffer },
  name: "LetterView",
  props: {
    letter: {
      type: Object,
      default: () => {},
    },
    offers: {
      type: Array,
      default: () => [],
    },
    emails: {
      type: Array,
    },
  },
  computed: {
    dateHandler() {
      return moment(this.letter.created_at).locale("ru").format("LLL");
    },
  },
};
</script>

<style>
</style>