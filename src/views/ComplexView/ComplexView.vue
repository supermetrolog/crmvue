<template>
	<div v-if="complex" class="ComplexView" @scroll="onScroll">
		<ComplexHeader :complex="complex" :editAccess="false"/>
		<ComplexMap :complex="complex"/>
		<ComplexAbout
			:complex="complex"
			:infrastructure="data.parameters.infrastructure"
			:railway="data.parameters.railway"
			:safety="data.parameters.safety"
		/>
		<ObjectHoldings :objects="complex.objects"/>
	</div>
</template>

<script>
import ObjectHoldings from "@/components/complex/object-holdings/ObjectHoldings.vue";
import ComplexAbout from "@/components/complex/complex-about/ComplexAbout.vue";
import ComplexMap from "@/components/complex/complex-map/ComplexMap.vue";
import ComplexHeader from "@/components/complex/complex-header/ComplexHeader.vue";
import data from "./complex-view.data";
import "./styles.scss";
import {ComplexActionTypes} from "@/store/modules/complex/actions";

export default {
	name: "ComplexView",
	components: {ComplexHeader, ComplexMap, ComplexAbout, ObjectHoldings},
	data() {
		return {
			aboutComplexProperties: {},
			holdings: data.holdings,
			data
		};
	},
	mounted() {
		this.$store.dispatch(ComplexActionTypes.FETCH_COMPLEX, {
			complexId: 2758,
		});
	},
	computed: {
		complex() {
			return this.$store.getters.complex;
		}
	},
	methods: {},
};
</script>
