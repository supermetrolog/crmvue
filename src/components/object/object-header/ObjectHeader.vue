<template>
  <div class="ObjectHeader">
    <div class="ObjectHeader-content">
      <h1 class="ObjectHeader-name">{{ complexName }}</h1>
      <span class="ObjectHeader-description">
        <strong>ID комплекса {{ id }}, </strong>
        поступление {{ complexPublDate }}, {{ consultant }}, последнее
        обновление {{ complexLastUpdate }}</span
      >
    </div>
    <div class="ObjectHeader-actions" v-if="editAccess">
      <button @click.prevent="clickUpdate">
        <i class="fas fa-pen text-primary edit"></i>
      </button>
    </div>
  </div>
</template>

<script>
import "./styles.scss";

export default {
  name: "ObjectHeader",
  components: {},
  props: {
    name: {
      type: String,
      default: "Нет названия",
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    creationDate: {
      type: [Number, String],
      default: "неизвестно",
    },
    updateDate: {
      type: [Number, String],
      default: "неизвестно",
    },
    consultant: {
      type: String,
      default: "неизвестен",
    },
    editAccess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dateFormatter: this.$formatter.date(),
    };
  },
  computed: {
    complexName() {
      return this.name ? this.name : "Нет названия";
    },
    complexLastUpdate() {
      return this.updateDate
        ? this.dateFormatter.locale(this.updateDate * 1000)
        : "нет данных";
    },
    complexPublDate() {
      return this.creationDate
        ? this.dateFormatter.locale(this.creationDate * 1000)
        : "нет данных";
    },
  },
  methods: {
    clickUpdate() {
      this.$emit("updateObject");
    },
  },
};
</script>
