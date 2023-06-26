<template>
	<div class="ObjectHoldingsParameters">
		<div class="ObjectHoldingsParameters-wrapper">
			<div class="ObjectHoldingsParameters-main">
				<p class="ObjectHoldingsParameters-main-area">
					<with-unit-type
							v-if="area !== null"
							:value="formattedArea"
							:unitType="unitTypes.SQUARE_METERS"
					/>
					<span v-else>не заполнено</span>
					(по этажам:
					<with-unit-type
							v-if="floorArea !== null"
							:value="formattedFloorArea"
							:unitType="unitTypes.SQUARE_METERS"
					/>
					<span v-else>не заполнено</span>
					)
				</p>
				<p class="ObjectHoldingsParameters-main-address">{{ address || "Адрес не заполнен" }}</p>
			</div>
			<div class="ObjectHoldingsParameters-types" v-if="holdingTypes">
				<template v-if="holdingTypes.length > 0">
					<strong
							class="object-type-box"
							v-for="objectType of holdingTypes"
							:key="objectType.id"
							:title="getObjectTypeName(objectType.object_type)"
					>
						<i :class="getObjectTypeIcon(objectType.object_type)"></i>
					</strong>
				</template>
				<div v-if="holdingTypes.length == 0 && holdingTypesGeneral.length == 0">
					<p>нет данных</p>
				</div>
			</div>
			<div class="ObjectHoldingsParameters-provision">
				<parameters
						v-if="parameters"
						:height="parameters.characteristics.height"
						:floorType="parameters.characteristics.floorType"
						:gatesNumber="parameters.characteristics.gatesNumber"
						:electricity="parameters.communications.electricity"
						:heating="parameters.communications.heating"
						:sewage="parameters.communications.sewage"
						:gasForProduction="parameters.communications.gasForProduction"
						:liftingDevices="parameters.liftingDevices.lifts"
						:shelving="parameters.facilities.shelving"
				/>
			</div>
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
		<div class="ObjectHoldingsParameters-floors" v-if="floors.length > 0">
			<div
					class="ObjectHoldingsParameters-floor"
					:class="{ danger: floor.danger }"
					v-for="floor in floors"
					:key="floor.number"
			>
				<span>{{ floor.number }} этаж</span>
				<i
						class="fas fa-exclamation-circle text-danger"
						v-if="floor.danger"
						title="Внимание"
				></i>
			</div>
		</div>
	</div>
</template>

<script>
import {ObjectTypeList} from "@/const/Const.js";
import "./styles.scss";
import Parameters from "@/components/complex/ui/parameters/Parameters.vue";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import {unitTypes} from "@/const/unitTypes";

export default {
	name: "ObjectHoldingsParameters",
	components: {
		Parameters,
		WithUnitType,
	},
	props: {
		holdingTypes: {
			type: Array,
			default: () => [],
			required: true,
		},
		holdingTypesGeneral: {
			type: Array,
			default: () => [],
			required: true,
		},
		floors: {
			type: Array,
			default: () => [],
			required: true,
		},
		parameters: {
			type: Object,
			required: true,
		},
		area: {
			type: [Number, null],
			required: true
		},
		floorArea: {
			type: [Number, null],
			required: true
		},
		address: {
			type: [String, null],
			required: true
		},
	},
	data() {
		return {
			objectTypeListWareHouse: ObjectTypeList.get("warehouse"),
			objectTypeListProduction: ObjectTypeList.get("production"),
			objectTypeListPlot: ObjectTypeList.get("plot"),
			unitTypes,
			// objectTypesGeneralList: ObjectTypesGeneralList.get("param"),
		};
	},
	methods: {
		getObjectTypeIcon(objectType) {
			if (objectType < 12) {
				return this.objectTypeListWareHouse.find(
						(item) => item[0] == objectType
				)[1].icon;
			}
			if (objectType < 25) {
				return this.objectTypeListProduction.find(
						(item) => item[0] == objectType
				)[1].icon;
			}
			return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
					.icon;
		},
		getObjectTypeName(objectType) {
			if (objectType < 12) {
				return this.objectTypeListWareHouse.find(
						(item) => item[0] == objectType
				)[1].name;
			}
			if (objectType < 25) {
				return this.objectTypeListProduction.find(
						(item) => item[0] == objectType
				)[1].name;
			}
			return this.objectTypeListPlot.find((item) => item[0] == objectType)[1]
					.name;
		},
		// getObjectTypesGeneral(types) {
		//     return types
		//         .map((type) => type.type)
		//         .map(
		//             (type) =>
		//                 this.objectTypesGeneralList.find((item) => item[0] == type)[1]
		//         )
		//         .join(", ");
		// },
	},
	computed: {
		formattedArea() {
			return this.$formatter.number(
					this.area
			);
		},
		formattedFloorArea() {
			return this.$formatter.number(
					this.floorArea
			);
		},
	},
};
</script>
