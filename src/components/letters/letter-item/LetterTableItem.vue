<template>
  <tr>
    <td>
      {{ letter.id }}
      <!-- <div>{{ letter.body }}</div> -->
      <!-- <div>{{ letter.id }}</div> -->
    </td>
    <td>{{ letter.created_at }}</td>
    <td>{{ user }}</td>
  </tr>
</template>

<script>
import { mapGetters } from "vuex";
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
  },
};
</script>
