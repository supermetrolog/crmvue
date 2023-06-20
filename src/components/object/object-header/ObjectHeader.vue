<template>
  <div class="ObjectHeader">
    <div class="ObjectHeader-content">
      <h1 class="ObjectHeader-name">{{ complex.name || 'Нет названия' }}</h1>
      <span class="ObjectHeader-description">
        <strong>ID комплекса {{ complex.id }}, </strong>
        поступление {{ complex.createdAt }}, {{ complex.consultantName }}, последнее
        обновление {{ complex.lastUpdatedAt }}</span
      >
    </div>
    <div class="ObjectHeader-actions" v-if="editAccess">
      <button>
        <i class="fas fa-pen text-primary edit"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import "./styles.scss";
import {PropType} from "vue";
import IComplex from "@/interfaces/IComplex";

export default {
  name: "ObjectHeader",
  components: {},
  props: {
	complex: {
      type: Object as PropType<IComplex>,
      required: true,
	},
    editAccess: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
