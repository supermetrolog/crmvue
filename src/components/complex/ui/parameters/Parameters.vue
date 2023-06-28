<template>
  <ul class="object-parameters">
    <li v-if="object.ceilingHeight" class="object-parameters__item">
      <i class="fas fa-arrow-up" />
      <with-unit-type
        :unit-type="unitTypes.METERS"
        :value="$formatter.number(object.ceilingHeight)"
      />
    </li>
<!--    <li v-if="gatesNumber?.valueMin" class="object-parameters__item">-->
<!--      <i class="fas fa-dungeon" />-->
<!--      {{-->
<!--        $formatter.numberOrRangeNew(gatesNumber.valueMin, gatesNumber.valueMax)-->
<!--      }}-->
<!--      ворот(а)-->
<!--    </li>-->
    <li v-if="object.floorType" class="object-parameters__item">
      <i class="fas fa-arrow-down" />
      {{ object.floorType }}
    </li>
    <li v-if="object.gas" class="object-parameters__item">
      <i class="fas fa-fire" />
      Газ в цеху
    </li>
    <li v-if="object.powerValue" class="object-parameters__item">
      <i class="fas fa-bolt" />
      <with-unit-type
        :unit-type="unitTypes.KILOWATT"
        :value="
          $formatter.number(
            object.powerValue
          )
        "
      />
    </li>
    <li v-if="object.heating" class="object-parameters__item">
      <i class="fa fa-thermometer-full" />
      Отопление
    </li>
    <li v-if="object.sewage" class="object-parameters__item">
      <i class="fas fa-shower" />
      Канализация
    </li>
<!--    <li v-if="liftingDevices?.valueMin" class="object-parameters__item">-->
<!--      <i class="fas fa-angle-double-up" />-->
<!--      Подъемники-->
<!--      <with-unit-type-->
<!--        :unit-type="liftingDevices.unitType"-->
<!--        :value="-->
<!--          $formatter.numberOrRangeNew(-->
<!--            liftingDevices.valueMin,-->
<!--            liftingDevices.valueMax-->
<!--          )-->
<!--        "-->
<!--      />-->
<!--      - -->
<!--      <p class="object-parameters__item object-parameters__item_list">-->
<!--        <with-unit-type-->
<!--          v-for="weight in liftingDevices.liftingDevicesWeight"-->
<!--          :unit-type="unitTypes.TON"-->
<!--          :key="weight"-->
<!--          :value="weight"-->
<!--        />-->
<!--      </p>-->
<!--    </li>-->
<!--    <li v-if="shelving?.value" class="object-parameters__item">-->
<!--      <i class="fa fa-th" />-->
<!--      Стеллажи-->
<!--    </li>-->
  </ul>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import { unitTypes } from "@/const/unitTypes";
import IObject from "@/interfaces/object.interface";

export default defineComponent({
  name: "Parameters",
  components: {
    WithUnitType,
  },
  props: {
		object: {
			type: Object as PropType<IObject>,
			required: true,
			default: () => {}
		}
    // height: {
    //   type: Object as PropType<ICharacterictic>,
    // },
    // floorType: {
    //   type: Object as PropType<ICharacterictic>,
    // },
    // gatesNumber: {
    //   type: Object as PropType<ICharacterictic>,
    // },
    // electricity: {
    //   type: Object as PropType<ICharacterictic>,
    // },
    // heating: {
    //   type: Object as PropType<ICharacterictic>,
    // },
    // sewage: {
    //   type: Object as PropType<ICharacterictic>,
    // },
    // gasForProduction: {
    //   type: Object as PropType<ICharacterictic>,
    // },
    // liftingDevices: {
    //   type: Object as PropType<ICharacterictic>,
    // },
    // shelving: {
    //   type: Object as PropType<ICharacterictic>,
    // },
  },
  data() {
    return {
      unitTypes,
    };
  },
  computed: {},
});
</script>

<style src="./Parameters.scss" lang="scss" />
