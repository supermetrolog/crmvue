<template>
  <div class="ObjectHolding">
    <div class="ObjectHolding-body">
      <div class="ObjectHolding-carousel">
        <div class="ObjectHolding-label">ID {{ id }}</div>
        <Carousel />
      </div>
      <div class="ObjectHolding-info">
        <div class="ObjectHolding-info-left">
          <ObjectHoldingsParameters
            :holdingTypes="types"
            :holdingTypesGeneral="typesGeneral"
            :floors="floors"
            :parameters="parameters"
            :area="area"
            :floorArea="floorArea"
            :address="address"
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
    },
    types: {
      type: Array,
    },
    typesGeneral: {
      type: Array,
    },
    floors: {
      type: Array,
    },
    parameters: {
      type: Object,
    },
    properties: {
      type: Array,
    },
    area: {
      type: Object,
      required: true,
    },
    floorArea: {
      type: Object,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
  },
};
</script>
