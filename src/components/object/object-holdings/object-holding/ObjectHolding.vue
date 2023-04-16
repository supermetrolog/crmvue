<template>
  <div class="ObjectHolding">
    <div class="ObjectHolding-header">
      <span v-if="type === 1">СТРОЕНИЕ</span>
      <span v-if="type === 2">УЧАСТОК</span>
      <span>ID {{ id }}</span>
    </div>
    <div class="ObjectHolding-body">
      <div class="ObjectHolding-carousel">
        <Carousel />
      </div>
      <div class="ObjectHolding-info">
        <div class="ObjectHolding-info-left">
          <ObjectHoldingsParameters
            :holdingTypes="types"
            :holdingTypesGeneral="typesGeneral"
            :floors="floors"
          />
        </div>
        <div class="ObjectHolding-info-right">
          <ObjectHoldingsOwnerList :owners="owners" />
        </div>
      </div>
    </div>
    <ObjectHoldingsTabs :holdingsProperties="properties" />
  </div>
</template>

<script>
import ObjectHoldingsTabs from "../object-holdings-tabs/ObjectHoldingsTabs.vue";
import ObjectHoldingsOwnerList from "../object-holdings-owners/ObjectHoldingsOwnerList.vue";
import ObjectHoldingsParameters from "../object-holdings-parameters/ObjectHoldingsParameters.vue";
import Carousel from "../../../common/carousel/Carousel.vue";
import "./styles.scss";

export default {
  name: "ObjectHolding",
  components: {
    Carousel,
    ObjectHoldingsParameters,
    ObjectHoldingsOwnerList,
    ObjectHoldingsTabs,
  },
  props: {
    id: {
      type: Number,
      default: 1488,
    },
    type: {
      type: Number,
      default: null,
    },
    owners: {
      type: Array,
      default: () => [],
    },
    types: {
      type: Array,
      default: () => [],
    },
    typesGeneral: {
      type: Array,
      default: () => [],
    },
    floors: {
      type: Array,
      default: () => [],
    },
    properties: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
