<template>
	<div class="ComplexAbout" id="ComplexAbout">
		<Tabs :options="{ useUrlFragment: false }">
			<Tab name="О комплексе" v-if="complex">
				<div class="ComplexAbout-content">
					<template v-if="dataAvailable">
						<PropertyList title="Площади">
							<PropertyListItem name="S - участка общая">
								<with-unit-type class="ComplexAbout-property" v-if="complex.areaFieldFull !== null"
												:unit-type="unitTypes.SQUARE_METERS"
												:value="$formatter.number(complex.areaFieldFull)"/>
							</PropertyListItem>
							<PropertyListItem name="S - строений в комплексе">
								<with-unit-type class="ComplexAbout-property" v-if="complex.areaBuilding !== null"
												:unit-type="unitTypes.SQUARE_METERS"
												:value="$formatter.number(complex.areaBuilding)"/>
							</PropertyListItem>
							<PropertyListItem name="S - этажей общая">
								<with-unit-type class="ComplexAbout-property" v-if="complex.areaFloorFull !== null"
												:unit-type="unitTypes.SQUARE_METERS"
												:value="$formatter.number(complex.areaFloorFull)"/>
							</PropertyListItem>
							<PropertyListItem name="S - оффисов общая">
								<with-unit-type class="ComplexAbout-property" v-if="complex.areaOfficeFull !== null"
												:unit-type="unitTypes.SQUARE_METERS"
												:value="$formatter.number(complex.areaOfficeFull)"/>
							</PropertyListItem>
							<PropertyListItem name="S - техническая общая">
								<with-unit-type class="ComplexAbout-property" v-if="complex.areaTechFull !== null"
												:unit-type="unitTypes.SQUARE_METERS"
												:value="$formatter.number(complex.areaTechFull)"/>
							</PropertyListItem>
							<PropertyListItem name="Управляющая компания">
								<p v-if="complex.managmentCompany !== null" class="ComplexAbout-property">
									{{ managmentCompany }}
								</p>
							</PropertyListItem>
						</PropertyList>
						<PropertyList title="Коммуникации">
							<PropertyListItem name="Электричество">
								<template v-if="complex.power !== null">
									<with-unit-type class="ComplexAbout-property" v-if="complex.power"
													:unit-type="unitTypes.KILOWATT"
													:value="$formatter.number(complex.powerValue)"/>
									<p v-else class="ComplexAbout-property">
										нет
									</p>
								</template>
							</PropertyListItem>
							<PropertyListItem name="Отопление центральное">
								<p v-if="complex.heating !== null" class="ComplexAbout-property">
									{{ isExists(complex.heating) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Отопление автономное">
								<template v-if="complex.heatingAutonomous !== null">
									<p v-if="complex.heatingAutonomous" class="ComplexAbout-property">
										есть, <span class="ComplexAbout-property-grey">{{
											complex.heatingAutonomousType
										}}</span>
									</p>
									<p v-else class="ComplexAbout-property">
										нет
									</p>
								</template>
							</PropertyListItem>
							<PropertyListItem name="Водоснабжение">
								<template v-if="complex.water !== null">
									<p v-if="complex.water" class="ComplexAbout-property" :title="'есть, ' + joinedWaterType">
										есть, <span
													class="ComplexAbout-property-grey">{{
											joinedWaterType
										}}</span>
									</p>
									<p v-else class="ComplexAbout-property">
										нет
									</p>
								</template>
							</PropertyListItem>
							<PropertyListItem name="Канализация">
								<p v-if="complex.sewage !== null" class="ComplexAbout-property">
									{{ isExists(complex.sewage) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Ливневая канал.">
								<p v-if="complex.sewageRain !== null" class="ComplexAbout-property">
									{{ isExists(complex.sewageRain) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Газ">
								<template v-if="complex.gas !== null">
									<with-unit-type class="ComplexAbout-property" v-if="complex.gas"
													:unit-type="unitTypes.CUBE_METERS_PER_HOUR"
													:value="$formatter.number(complex.gasValue)"/>
									<p v-else class="ComplexAbout-property">
										нет
									</p>
								</template>
							</PropertyListItem>
							<PropertyListItem name="Пар">
								<template v-if="complex.steam !== null">
									<with-unit-type class="ComplexAbout-property" v-if="complex.steam"
													:unit-type="unitTypes.CUBE_METERS_PER_HOUR"
													:value="$formatter.number(complex.steamValue)"/>
									<p v-else class="ComplexAbout-property">
										нет
									</p>
								</template>
							</PropertyListItem>
							<PropertyListItem name="Телефония">
								<p v-if="complex.phoneLine !== null" class="ComplexAbout-property">
									{{ isExists(complex.phoneLine) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Интернет">
								<template v-if="complex.internet !== null">
									<p v-if="complex.internet" class="ComplexAbout-property" :title="'есть, ' + joinedInternetType">
										есть, <span
										class="ComplexAbout-property-grey">{{
											joinedInternetType
										}}</span>
									</p>
									<p v-else class="ComplexAbout-property">
										нет
									</p>
								</template>
							</PropertyListItem>
						</PropertyList>
						<PropertyList title="Безопасность">
							<PropertyListItem name="Охрана объекта">
								<template v-if="complex.guard !== null">
									<p v-if="complex.guard" class="ComplexAbout-property" :title="'есть, ' + joinedGuardType">
										есть, <span
										class="ComplexAbout-property-grey">{{
											joinedGuardType
										}}</span>
									</p>
									<p v-else class="ComplexAbout-property">
										нет
									</p>
								</template>
							</PropertyListItem>
							<PropertyListItem name="Видеонабл. наруж.">
								<p v-if="complex.videoControl !== null" class="ComplexAbout-property">
									{{ isExists(complex.videoControl) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Контр. дост. наруж.">
								<p v-if="complex.accessControl !== null" class="ComplexAbout-property">
									{{ isExists(complex.accessControl) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Охран. сигнал. наруж.">
								<p v-if="complex.securityAlert !== null" class="ComplexAbout-property">
									{{ isExists(complex.securityAlert) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Шлагбаум">
								<p v-if="complex.barrier !== null" class="ComplexAbout-property">
									{{ isExists(complex.barrier) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Забор по периметру">
								<p v-if="complex.fenceAroundPerimeter !== null" class="ComplexAbout-property">
									{{ isExists(complex.fenceAroundPerimeter) }}
								</p>
							</PropertyListItem>
							<PropertyListItem name="Пожарная сигнализация">
								<p v-if="complex.fireAlert !== null" class="ComplexAbout-property">
									{{ isExists(complex.fireAlert) }}
								</p>
							</PropertyListItem>
						</PropertyList>
						<PropertyList :title="['Ж/Д на территории', 'Инфраструктура']">
							<template #0>
								<PropertyListItem name="Ж/Д ветка">
									<p v-if="complex.railway !== null" class="ComplexAbout-property">
										{{ isExists(complex.railway) }}
									</p>
								</PropertyListItem>
							</template>
							<template #1>
								<PropertyListItem name="Въезд на территорию">
									<template v-if="complex.entryTerritory !== null">
										<p v-if="complex.entryTerritory && complex.entryTerritoryType" class="ComplexAbout-property">
											{{ complex.entryTerritoryType }}
										</p>
										<p v-else-if="complex.entryTerritory" class="ComplexAbout-property">
											есть
										</p>
										<p v-else class="ComplexAbout-property">
											нет
										</p>
									</template>
								</PropertyListItem>
								<PropertyListItem name="Плата за въезд">
									<p v-if="complex.entryFee !== null && complex.entryTerritory"
									   class="ComplexAbout-property">
										{{ complex.entryFee }}
									</p>
								</PropertyListItem>
								<PropertyListItem name="«P» легковая">
									<p v-if="complex.parkingCar !== null" class="ComplexAbout-property">
										{{ isExists(complex.parkingCar) }}
									</p>
								</PropertyListItem>
								<PropertyListItem name="«P» 3-10 тонн">
									<p v-if="complex.parkingLorry !== null" class="ComplexAbout-property">
										{{ isExists(complex.parkingLorry) }}
									</p>
								</PropertyListItem>
								<PropertyListItem name="«P» от 10 тонн">
									<p v-if="complex.parkingTruck !== null" class="ComplexAbout-property">
										{{ isExists(complex.parkingTruck) }}
									</p>
								</PropertyListItem>
								<PropertyListItem name="Столовая/кафе">
									<p v-if="complex.canteen !== null" class="ComplexAbout-property">
										{{ isExists(complex.canteen) }}
									</p>
								</PropertyListItem>
								<PropertyListItem name="Общежитие">
									<p v-if="complex.hostel !== null" class="ComplexAbout-property">
										{{ isExists(complex.hostel) }}
									</p>
								</PropertyListItem>
							</template>
						</PropertyList>
					</template>
					<template v-else>Нет данных</template>
				</div>
			</Tab>
			<Tab name="План Территории">
				<div class="ComplexAbout-content">123</div>
			</Tab>
			<Tab name="Презентации">
				<div class="ComplexAbout-content">123</div>
			</Tab>
			<Tab name="Документы">
				<div class="ComplexAbout-content">123</div>
			</Tab>
		</Tabs>
	</div>
</template>

<script lang="ts">
import PropertyListItem from "../../common/property-list/property-list-item/PropertyListItem.vue";
import PropertyList from "../../common/property-list/PropertyList.vue";
import "./styles.scss";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
import {unitTypes} from "@/const/unitTypes";
import {defineComponent, PropType} from "vue";
import IComplex from "@/interfaces/complex.interface";

export default defineComponent({
	inject: {
		injectedIsMobile: {
			from: "isMobile"
		}
	},
	name: "ComplexAbout",
	components: {WithUnitType, PropertyList, PropertyListItem},
	props: {
		complex: {
			type: Object as PropType<IComplex>,
			required: true
		},
		safety: {
			type: Array,
		},
		railway: {
			type: Array,
		},
		infrastructure: {
			type: Array,
		},
	},
	data() {
		return {
			unitTypes,
			isMobile: this.injectedIsMobile
		};
	},
	computed: {
		dataAvailable() {
			return (
				this.safety &&
				this.railway &&
				this.infrastructure
			);
		},
		managmentCompany() {
			return this.complex?.managmentCompany ? this.complex.managmentCompanyValue : "нет"
		},
		joinedGuardType(): string {
			return this.complex?.guardType ? this.complex.guardType.join(", ") : ""
		},
		joinedInternetType(): string {
			return this.complex?.internetType ? this.complex.internetType.join(", ") : ""
		},
		joinedWaterType(): string {
			return this.complex?.waterType ? this.complex.waterType.join(", ") : ""
		},
	},
	methods: {
		isExists(value: boolean): string {
			return value ? "есть" : "нет";
		}
	},
	mounted() {
		if (this.isMobile) {
			return;
		} else {
			requestAnimationFrame(() => {
				// const listElement = document.getElementById("ComplexAbout");
				// const listHeight = listElement?.clientHeight;
			});
		}
	},
});
</script>
