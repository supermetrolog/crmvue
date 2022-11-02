<template>
  <tr>
    <td>
      {{ letter.id }}
      <!-- <div>{{ letter.body }}</div> -->
      <!-- <div>{{ letter.id }}</div> -->
    </td>
    <td>{{ dateHandler }}</td>
    <td>{{ letter.user.email }}</td>
    <td><div class="text-left" v-html="letter.body"></div></td>
    <td>
      <span v-for="offer in letter.letterOffers" :key="offer.id">{{
        offer.id
      }}</span>
    </td>
    <td>
      <div v-for="contact in letter.letterContacts" :key="contact.id">
        {{ contact.email.email }}
      </div>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "LetterTableItem",
  props: {
    letter: {
      type: Object,
    },
    odd: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(["USERS"]),
    user() {
      return this.USERS.find((user) => user.id === this.letter.user_id);
    },
    dateHandler() {
      // const todayIs = new Date();

      return moment(this.letter.created_at).calendar();
    },
  },
};
</script>
