<template>
  <div class="ObjectHoldingsOwnerList">
    <ObjectHoldingsOwnerItem v-if="company"
                             :owner="company"
    />
  </div>
</template>

<script lang="ts">
import ObjectHoldingsOwnerItem from "./object-holdings-owner-item/ObjectHoldingsOwnerItem.vue";
import "./styles.scss";
import {defineComponent, PropType} from "vue";
import {ICompany} from "@/interfaces/company.interface";

export default defineComponent({
  name: "ObjectHoldingsOwnerList",
  components: {ObjectHoldingsOwnerItem},
  props: {
    company: {
      type: Object as PropType<ICompany>,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
});
</script>
