<template>
	<div class="ObjectHoldingsTabs">
		<action-buttons v-bind="actionButtons" class="ObjectHoldingsTabs-buttons"/>
		<Tabs :options="{ useUrlFragment: false }">
			<Tab name="Характеристики">
				<div class="ObjectHoldingsTabs-content-properties" v-if="!isPlot">
					<PropertyList>
						<PropertyListItem name="Общая площадь">
							<with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.area !== null"
															:unit-type="unitTypes.SQUARE_METERS"
															:value="$formatter.number(object.area)"/>
						</PropertyListItem>
						<PropertyListItem name="S - пола">
							<with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.floorArea !== null"
															:unit-type="unitTypes.SQUARE_METERS"
															:value="$formatter.number(object.floorArea)"/>
						</PropertyListItem>
						<PropertyListItem name="S - мезонина">
							<with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.areaMezanin !== null"
															:unit-type="unitTypes.SQUARE_METERS"
															:value="$formatter.number(object.areaMezanin)"/>
						</PropertyListItem>
					</PropertyList>
					<PropertyList>
						<PropertyListItem name="S - офисов">
							<with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.areaOffice !== null"
															:unit-type="unitTypes.SQUARE_METERS"
															:value="$formatter.number(object.areaOffice)"/>
						</PropertyListItem>
						<PropertyListItem name="S - техническая">
							<with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.areaTech !== null"
															:unit-type="unitTypes.SQUARE_METERS"
															:value="$formatter.number(object.areaTech)"/>
						</PropertyListItem>
						<PropertyListItem name="Этажность склада">
							<with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.floorsCount !== null"
															:unit-type="unitTypes.FLOORS"
															:value="$formatter.number(object.floorsCount)"/>
						</PropertyListItem>
						<PropertyListItem name="Класс объекта">
							<p class="ObjectHoldingsTabs-content-property" v-if="object.objectClass !== null">{{ object.objectClass }}</p>
						</PropertyListItem>
					</PropertyList>
					<PropertyList>
						<PropertyListItem name="Внешняя отделка">
							<p class="ObjectHoldingsTabs-content-property" :title="object.facing" v-if="object.facing !== null">{{
									object.facing
								}}</p>
						</PropertyListItem>
						<PropertyListItem name="Год постройки">
							<with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.yearBuild !== null"
															:unit-type="unitTypes.YEAR"
															:value="object.yearBuild"/>
						</PropertyListItem>
						<PropertyListItem name="Год последнего ремонта">
							<with-unit-type class="ObjectHoldingsTabs-content-property" v-if="object.yearRepair !== null"
															:unit-type="unitTypes.YEAR"
															:value="object.yearRepair"/>
						</PropertyListItem>
					</PropertyList>
					<PropertyList>
						<PropertyListItem name="Кадастровый №">
							<p class="ObjectHoldingsTabs-content-property" :title="object.cadastralNumber" v-if="object.cadastralNumber !== null">
								{{ object.cadastralNumber }}</p>
						</PropertyListItem>
						<PropertyListItem name="Правовой статус строения" :title="object.ownType">
							<p class="ObjectHoldingsTabs-content-property" v-if="object.ownType !== null">{{ object.ownType }}</p>
						</PropertyListItem>
						<PropertyListItem name="Ограничения">
							<p class="ObjectHoldingsTabs-content-property" v-if="object.restrictions !== null">{{ object.restrictions }}</p>
						</PropertyListItem>
					</PropertyList>
				</div>
				<div class="ObjectHoldingsTabs-content-properties" v-else>
					Plot
				</div>
			</Tab>
			<Tab name="Сделки">
				<div class="ObjectHoldingsTabs-content">
					<ObjectHoldingDeals/>
				</div>
			</Tab>
			<Tab name="Карта сделок"></Tab>
			<Tab name="Планировки"></Tab>
			<Tab name="Презентации"></Tab>
			<Tab name="Договоры"></Tab>
			<Tab name="Панорамы"></Tab>
			<Tab name="Описание"></Tab>
			<Tab name="Задачи"></Tab>
		</Tabs>
	</div>
</template>

<script lang="ts">
import PropertyListItem from "@/components/common/property-list/property-list-item/PropertyListItem.vue";
import PropertyList from "@/components/common/property-list/PropertyList.vue";
import ObjectHoldingDeals from "../deals/Deals.vue";
import ActionButtons from "@/components/common/action-buttons/ActionButtons.vue";
import "./styles.scss";
import {defineComponent, PropType} from "vue";
import IObject from "@/interfaces/object.interface";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import {unitTypes} from "@/const/unitTypes";
import {ObjectTypes} from "@/types/objectTypes.enum";

export default defineComponent({
	name: "ObjectHoldingsTabs",
	components: {
		WithUnitType,
		PropertyList,
		PropertyListItem,
		ObjectHoldingDeals,
		ActionButtons,
	},
	props: {
		object: {
			type: Object as PropType<IObject>,
			required: true,
		},
	},
	data() {
		return {
			unitTypes
		};
	},
	computed: {
		actionButtons() {
			return {
				edit: {value: true},
				advert: {value: true},
				dislike: {value: true},
				notifications: {value: true},
				pdf: {value: true},
			};
		},
		isPlot() {
			return this.object.objectType?.includes(ObjectTypes.PLOT)
		}
	},
	methods: {},
});
</script>

<style lang="scss" scoped></style>
