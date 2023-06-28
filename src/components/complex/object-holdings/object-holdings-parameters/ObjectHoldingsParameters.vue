<template>
	<div class="ObjectHoldingsParameters">
		<div class="ObjectHoldingsParameters-wrapper">
			<div class="ObjectHoldingsParameters-main">
				<p class="ObjectHoldingsParameters-main-area">
					<with-unit-type
							v-if="object.areaBuilding !== null || object.areaField !== null"
							:value="formattedArea"
							:unitType="unitTypes.SQUARE_METERS"
					/>
					<span v-else>не заполнено</span>
					<template v-if="!object.objectType?.includes(3)">
					(по этажам:
					<with-unit-type
							v-if="object.floorArea !== null"
							:value="formattedFloorArea"
							:unitType="unitTypes.SQUARE_METERS"
					/>
					<span v-else>не заполнено</span>
					)
					</template>
				</p>
				<p class="ObjectHoldingsParameters-main-address">{{ object.address || "Адрес не заполнен" }}</p>
			</div>
			<div class="ObjectHoldingsParameters-types" v-if="object.purposes">
				<template v-if="object.purposes?.length > 0 && object.objectType">
					<strong
							class="object-type-box"
							v-for="purpose of object.purposes"
							:key="purpose"
							:title="getObjectTypeName(purpose)"
					>
						<i :class="getObjectTypeIcon(purpose)"></i>
					</strong>
				</template>
				<div v-if="object.purposes.length == 0 && object.purposes.length == 0">
					<p>нет данных</p>
				</div>
			</div>
<!--			<div class="ObjectHoldingsParameters-provision">-->
<!--				<parameters-->
<!--						v-if="object.parameters"-->
<!--						:height="object.parameters.characteristics.height"-->
<!--						:floorType="object.parameters.characteristics.floorType"-->
<!--						:gatesNumber="object.parameters.characteristics.gatesNumber"-->
<!--						:electricity="object.parameters.communications.electricity"-->
<!--						:heating="object.parameters.communications.heating"-->
<!--						:sewage="object.parameters.communications.sewage"-->
<!--						:gasForProduction="object.parameters.communications.gasForProduction"-->
<!--						:liftingDevices="object.parameters.liftingDevices.lifts"-->
<!--						:shelving="object.parameters.facilities.shelving"-->
<!--				/>-->
<!--			</div>-->
			<!-- <div class="ObjectHoldingsParameters-equipment">
				<p>Краны</p>
				<div>
					<span>Тельфер/лебедка (неподвижн)</span>
				</div>
			</div>
			<div class="ObjectHoldingsParameters-equipment">
				<p>Подъемники</p>
				<div>
					<span>Грузовой лифт</span>
				</div>
			</div> -->
		</div>
<!--		<div class="ObjectHoldingsParameters-floors" v-if="object.floors.length > 0">-->
<!--			<div-->
<!--					class="ObjectHoldingsParameters-floor"-->
<!--					:class="{ danger: object.floors.danger }"-->
<!--					v-for="floor in object.floors"-->
<!--					:key="floor.number"-->
<!--			>-->
<!--				<span>{{ floor.number }} этаж</span>-->
<!--				<i-->
<!--						class="fas fa-exclamation-circle text-danger"-->
<!--						v-if="floor.danger"-->
<!--						title="Внимание"-->
<!--				></i>-->
<!--			</div>-->
<!--		</div>-->
	</div>
</template>

<script lang="ts">
import "./styles.scss";
// import Parameters from "@/components/complex/ui/parameters/Parameters.vue";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import {unitTypes} from "@/const/unitTypes";
import {defineComponent, PropType} from "vue";
import IObject from "@/interfaces/object.interface";
import {objectPurposes} from "@/const/constTypes";

export default defineComponent({
	name: "ObjectHoldingsParameters",
	components: {
		// Parameters,
		WithUnitType,
	},
	props: {
		object: {
			type: Object as PropType<IObject>,
			required: true
		}
	},
	data() {
		return {
			unitTypes,
		};
	},
	methods: {
		getObjectTypeIcon(purpose: number) {
			return objectPurposes[purpose].icon
		},
		getObjectTypeName(purpose: number) {
			return objectPurposes[purpose].name
		},
	},
	computed: {
		formattedArea() {
			if (this.object.objectType?.includes(3)) {
				return this.$formatter.number(
						this.object.areaField
				);
			} else {
					return this.$formatter.number(
							this.object.areaBuilding
					);
			}
		},
		formattedFloorArea() {
			return this.$formatter.number(
					this.object.floorArea
			);
		},
	},
})
</script>
