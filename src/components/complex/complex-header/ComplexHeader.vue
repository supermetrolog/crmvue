<template>
  <div class="ComplexHeader">
    <div class="ComplexHeader-content">
      <h1 class="ComplexHeader-name">{{ complex.name || "Нет названия" }}</h1>
      <span class="ComplexHeader-description">
        <strong>ID комплекса {{ complex.id }}, </strong>
        поступление {{ complex.createdAt }}, {{ complex.consultantName }},
        последнее обновление {{ complex.lastUpdatedAt }}</span
      >
    </div>
    <div class="ComplexHeader-actions" v-if="editAccess">
      <button>
        <i class="fas fa-pen text-primary edit"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import "./styles.scss";
import { PropType } from "vue";
import ComplexInterface from "@/interfaces/complex.interface";

export default {
  name: "CopmlexHeader",
  components: {},
  props: {
    complex: {
      type: Object as PropType<ComplexInterface>,
      required: true,
    },
    editAccess: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
