<template>
  <ul class="object-parameters">
    <li v-if="height && height.value" class="object-parameters__item">
      <i class="fas fa-arrow-up" />
      <with-unit-type :unit-type="height.unitType" :value="height.value" />
    </li>
    <li
      v-if="gatesNumber && gatesNumber?.value"
      class="object-parameters__item"
    >
      <i class="fas fa-dungeon" />
      {{ gatesNumber.value }} ворот(а)
    </li>
    <li v-if="floorType && floorType?.value" class="object-parameters__item">
      <i class="fas fa-arrow-down" />
      {{ floorType.value }}
    </li>
    <li
      v-if="gasForProduction && gasForProduction?.value"
      class="object-parameters__item"
    >
      <i class="fas fa-fire" />
      Газ в цеху
    </li>
    <li v-if="electricity && electricity.value" class="object-parameters__item">
      <i class="fas fa-bolt" />
      <with-unit-type
        :unit-type="electricity.unitType"
        :value="electricity.value"
      />
    </li>
    <li v-if="heating && heating.value" class="object-parameters__item">
      <i class="fa fa-thermometer-full" />
      Отопление
    </li>
    <li v-if="sewage && sewage.value" class="object-parameters__item">
      <i class="fas fa-shower" />
      Канализация
    </li>
    <li
      v-if="liftingDevices && liftingDevices.value"
      class="object-parameters__item"
    >
      <i class="fas fa-angle-double-up" />
      Подъемники
      <with-unit-type
        :unit-type="liftingDevices.unitType"
        :value="liftingDevices.value"
      />
      <with-unit-type
        v-for="weight in liftingDevices.liftingDevicesWeight"
        :unit-type="unitTypes.TON"
        :key="weight"
        :value="weight"
      />
    </li>
    <li v-if="shelving && shelving.value" class="object-parameters__item">
      <i class="fa fa-th" />
      Стеллажи
    </li>
  </ul>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import { unitTypes } from "@/const/unitTypes";
import { ICharacterictic } from "@/const/tradeOfferCharacteristics";

export default defineComponent({
  name: "Parameters",
  components: {
    WithUnitType,
  },
  props: {
    height: {
      type: Object as PropType<ICharacterictic>,
    },
    floorType: {
      type: Object as PropType<ICharacterictic>,
    },
    gatesNumber: {
      type: Object as PropType<ICharacterictic>,
    },
    electricity: {
      type: Object as PropType<ICharacterictic>,
    },
    heating: {
      type: Object as PropType<ICharacterictic>,
    },
    sewage: {
      type: Object as PropType<ICharacterictic>,
    },
    gasForProduction: {
      type: Object as PropType<ICharacterictic>,
    },
    liftingDevices: {
      type: Object as PropType<ICharacterictic>,
    },
    shelving: {
      type: Object as PropType<ICharacterictic>,
    },
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
