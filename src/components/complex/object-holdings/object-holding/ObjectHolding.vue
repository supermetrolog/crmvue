<template>
  <div class="ObjectHolding">
    <div class="ObjectHolding-body">
      <div class="ObjectHolding-carousel">
        <div class="ObjectHolding-label">ID {{ object.id }}</div>
        <Carousel :list="object.photo" />
      </div>
      <div class="ObjectHolding-info">
        <div class="ObjectHolding-info-left">
          <ObjectHoldingsParameters
            :holdingTypes="object.types"
            :holdingTypesGeneral="object.typesGeneral"
            :floors="object.floors"
            :parameters="object.parameters"
            :area="object.area"
            :floorArea="object.floorArea"
            :address="object.address"
          />
        </div>
        <div class="ObjectHolding-info-right">
          <ObjectHoldingsOwnerList v-if="false" :owners="object.owners" />
        </div>
      </div>
    </div>
    <ObjectHoldingsTabs :holdingsProperties="object.properties" v-if="object.properties" />
  </div>
</template>

<script lang="ts">
import ObjectHoldingsTabs from "../object-holdings-tabs/ObjectHoldingsTabs.vue";
import ObjectHoldingsOwnerList from "../object-holdings-owners/ObjectHoldingsOwnerList.vue";
import ObjectHoldingsParameters from "../object-holdings-parameters/ObjectHoldingsParameters.vue";
import Carousel from "../../../common/carousel/Carousel.vue";
import {defineComponent, PropType} from "vue";
import "./styles.scss";
import IObject from "@/interfaces/object.interface";

export default defineComponent({
  name: "ObjectHolding",
  components: {
    Carousel,
    ObjectHoldingsParameters,
    ObjectHoldingsOwnerList,
    ObjectHoldingsTabs,
  },
  props: {
    object: {
			type: Object as PropType<Record<string, any> & IObject>,
			required: true
		}
  },
});
</script>
