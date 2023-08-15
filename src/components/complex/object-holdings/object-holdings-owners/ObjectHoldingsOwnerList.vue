<template>
  <div class="ObjectHoldingsOwnerList">
    <ObjectHoldingsOwnerItem
      v-for="(owner, idx) in getOwners"
      :key="idx"
      :owner="owner"
      :index="idx + 1"
    />
  </div>
</template>

<script>
import ObjectHoldingsOwnerItem from "./object-holdings-owner-item/ObjectHoldingsOwnerItem.vue";
import "./styles.scss";

export default {
  name: "ObjectHoldingsOwnerList",
  components: { ObjectHoldingsOwnerItem },
  props: {
    owners: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // owners:[],
    }
  },
  computed: {
      getOwners(){
        return this.$store.state.complex.owners;
      }
  
 },
  methods: {},
};

</script>
