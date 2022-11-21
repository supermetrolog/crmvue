<template>
  <li
    class="LettersListItem"
    :class="{ 'LettersListItem-selected': letterIsCurrent }"
  >
    <div class="LettersListItem-header">
      <div class="LettersListItem-header-email">
        <p>
          {{ filteredMailTo }}
        </p>
      </div>
      <div class="LettersListItem-header-date">
        <p>{{ dateHandler }}</p>
      </div>
    </div>
    <div class="LettersListItem-from" v-if="mailFrom">от: {{ mailFrom }}</div>
    <div class="LettersListItem-body" v-html="body"></div>
    <div class="LettersListItem-offers">
      <template v-if="offersCount"
        ><i class="fas fa-paperclip"></i>
        <span>{{ offersCount }}</span></template
      >
    </div>
    <hr />
  </li>
</template>

<script>
import moment from "moment";

export default {
  name: "LettersListItem",
  props: {
    date: {
      required: true,
      type: String,
    },
    mailFrom: {
      type: String,
    },
    mailTo: {
      required: true,
      type: Array,
    },
    offersCount: {
      type: Number,
      default: 0,
    },
    body: {
      type: String,
      default: null,
    },
    letterIsCurrent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dateHandler() {
      return moment(this.date).locale("ru").format("L");
      // .calendar().split(",")[0];
    },
    filteredMailTo() {
      return [
        ...new Set(this.mailTo.map((contact) => contact.email.email)),
      ].join(", ");
    },
  },
};
</script>
