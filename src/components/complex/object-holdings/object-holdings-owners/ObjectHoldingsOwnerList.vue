<template>
  <div class="ObjectHoldingsOwnerList">
    <ObjectHoldingsOwnerItem
      :company="company"
    />
  </div>
</template>

<script lang="ts">
import ObjectHoldingsOwnerItem from "./object-holdings-owner-item/ObjectHoldingsOwnerItem.vue";
import "./styles.scss";
import {PropType, defineComponent} from "vue";
import {CompanyEntity} from "./../../../../entities/company.entity"

export default defineComponent ({
  name: "ObjectHoldingsOwnerList",
  components: { ObjectHoldingsOwnerItem },
  props: {
    company: {
      type: Object as PropType<CompanyEntity>,
    },
  },
});

</script>
