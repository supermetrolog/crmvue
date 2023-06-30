<template>
  <ul class="object-parameters">
    <li v-if="object.ceilingHeight" class="object-parameters__item">
      <i class="fas fa-arrow-up" />
      <with-unit-type
        :unit-type="unitTypes.METERS"
        :value="$formatter.number(object.ceilingHeight)"
      />
    </li>
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
		<li v-if="object.water" class="object-parameters__item">
			<i class="fas fa-tint"></i>
			Водоснабжение
    </li>
		<li v-if="object.water" class="object-parameters__item">
			<i class="fas fa-wifi"></i>
			Интернет, {{object.internetType}}
    </li>
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
  },
  data() {
    return {
      unitTypes,
    };
  },
  computed: {
	},
});
</script>

<style src="./Parameters.scss" lang="scss" />
