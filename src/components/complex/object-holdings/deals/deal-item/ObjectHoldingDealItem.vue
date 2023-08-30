
 <!-- ДЕТАЛИ И ОПИСАНИЕ ОБЪЕКТА ВМЕСТЕ С ЭТАЖАМИ В РАЗДЕЛЕ СДЕЛКИ -->
<template>
  <div class="DealItem">
    <DealFloors :object="object"  
   :floors="deal.floors"
   />.

    <DealInfo
      v-if="deal.additionalDetails"
      :company="deal.builder"
      :consultant="deal.consultant"
      :additionalDetails="deal.additionalDetails"
      :buildingInfo="deal.buildingInfo"
      :owner="deal.owner"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import IObject from "./../../../../../interfaces/object.interface";
import { IDeal }  from "./../../../../../interfaces/deal.interface";
import DealFloors from "./floors/DealFloors.vue";
import DealInfo from "../../deal-info/DealInfo.vue";
// import "./styles.scss";

export default defineComponent({
  name: "DealItem",
  components: {
    DealFloors,
    DealInfo,
  },
  props: {
    deal: {
      type: Object as PropType<IDeal>,
      required: true,
    },
    object: {
      type: Object as PropType<IObject>,
      required: true,
    }
  },
});
</script>
