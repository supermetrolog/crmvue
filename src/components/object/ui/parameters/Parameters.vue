<template>
  <ul class="object-parameters">
    <li v-if="height && height.valueMin" class="object-parameters__item">
      <i class="fas fa-arrow-up" />
      <with-unit-type
        :unit-type="height.unitType"
        :value="$formatter.numberOrRangeNew(height.valueMin, height.valueMax)"
      />
    </li>
    <li
      v-if="gatesNumber && gatesNumber.valueMin"
      class="object-parameters__item"
    >
      <i class="fas fa-dungeon" />
      {{
        $formatter.numberOrRangeNew(gatesNumber.valueMin, gatesNumber.valueMax)
      }}
      ворот(а)
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
    <li
      v-if="electricity && electricity.valueMin"
      class="object-parameters__item"
    >
      <i class="fas fa-bolt" />
      <with-unit-type
        :unit-type="electricity.unitType"
        :value="
          $formatter.numberOrRangeNew(
            electricity.valueMin,
            electricity.valueMax
          )
        "
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
      v-if="liftingDevices && liftingDevices.valueMin"
      class="object-parameters__item"
    >
      <i class="fas fa-angle-double-up" />
      Подъемники
      <with-unit-type
        :unit-type="liftingDevices.unitType"
        :value="
          $formatter.numberOrRangeNew(
            liftingDevices.valueMin,
            liftingDevices.valueMax
          )
        "
      />
      -
      <p class="object-parameters__item object-parameters__item_list">
        <with-unit-type
          v-for="weight in liftingDevices.liftingDevicesWeight"
          :unit-type="unitTypes.TON"
          :key="weight"
          :value="weight"
        />
      </p>
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
