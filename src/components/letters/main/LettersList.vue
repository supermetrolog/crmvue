<template>
  <div class="LettersList">
    <ul class="LettersList-scroller">
      <LettersListItem
        v-for="letter in letters"
        :key="letter.id"
        :date="letter.created_at"
        :mailFrom="letter.user.email || 'sklad@realtor.ru'"
        :mailTo="letter.letterEmails"
        :offersCount="letter.letterOffers.length"
        :body="letter.body"
        :letterIsCurrent="letter.id === this.selectedLetterId"
        @click="onClickLetter(letter.id)"
      />
    </ul>
  </div>
</template>

<script>
import LettersListItem from "../letter-item/LettersListItem.vue";

export default {
  name: "LettersList",
  components: {
    LettersListItem,
  },
  data() {
    return {
      currentLetterId: this.letters[0].id,
    };
  },
  props: {
    letters: {
      type: Array,
    },
    selectedLetterId: {
      type: Number,
    },
  },
  methods: {
    onClickLetter(id) {
      this.currentLetterId = id;
      this.$emit("letterClicked", this.currentLetterId);
    },
  },
};
</script>
