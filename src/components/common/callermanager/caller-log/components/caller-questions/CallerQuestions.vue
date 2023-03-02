<template>
  <div class="CallerQuestions">
    <span class="CallerQuestions-header">Дополнительно:</span>
    <span
      v-for="question in questionsList"
      :key="question.id"
      class="CallerQuestions-item"
      @click="clickQuestion(question.id)"
    >
      - {{ question.body }}
    </span>
  </div>
</template>

<script>
import "./styles.scss";

export default {
  name: "CallerQuestions",
  components: {},
  props: {
    questionsList: {
      type: Array,
      default: () => [],
    },
    sectionId: {
      type: Number || String,
      default: null,
    },
  },
  methods: {
    clickQuestion(id) {
      this.$emit("questionClicked", id, this.sectionId);
    },
  },
};
</script>