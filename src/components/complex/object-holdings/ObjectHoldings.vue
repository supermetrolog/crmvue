<template>
  <div class="ObjectHoldings">
    <div class="ObjectHoldings-header">
      <p>СТРОЕНИЯ ({{ buildingsCount }}), УЧАСТКИ ({{ landsCount }})</p>
      <div class="ObjectHoldings-header-icons">
        <button class="ObjectHoldings-header-button" @click="clickOpenCreateBuildingForm">
          <i class="fas fa-warehouse"></i>
        </button>
        <button class="ObjectHoldings-header-button" @click="clickOpenCreatePlotForm">
          <i class="fas fa-tree"></i>
        </button>
      </div>
    </div>
		<teleport to="body">
			<transition
					mode="out-in"
					enter-active-class="animate__animated animate__zoomIn for__modal absolute"
					leave-active-class="animate__animated animate__zoomOut for__modal absolute"
			>
		<BuildingCreateForm v-if="createBuildingFormVisible" @close="clickCloseCreateBuildingForm" />
			</transition>
		</teleport>
		<teleport to="body">
			<transition
					mode="out-in"
					enter-active-class="animate__animated animate__zoomIn for__modal absolute"
					leave-active-class="animate__animated animate__zoomOut for__modal absolute"
			>
				<PlotCreateForm v-if="createPlotFormVisible" @close="clickCloseCreatePlotForm" />
			</transition>
		</teleport>
    <div class="ObjectHoldings-body">
      <ObjectHolding
        v-for="object in objects"
        :key="object.id"
        :object="object"
      />
    </div>
  </div>
</template>

<script>
import ObjectHolding from "./object-holding/ObjectHolding.vue";
import "./styles.scss";
import BuildingCreateForm from "@/components/complex/object-holdings/forms/building-create-form/BuildingCreateForm.vue";
import PlotCreateForm from "@/components/complex/object-holdings/forms/plot-create-form/PlotCreateForm.vue";

export default {
  name: "ObjectHoldings",
  components: {BuildingCreateForm, ObjectHolding, PlotCreateForm },
  props: {
		objects: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
			createBuildingFormVisible: false,
			createPlotFormVisible: false
		};
  },
  computed: {
    buildingsCount() {
      let buildings = this.objects.filter((holding) => holding.type === 1);
      return buildings.length;
    },
    landsCount() {
      return this.objects.filter((holding) => holding.type === 2).length;
    },
  },
	methods: {
		clickOpenCreateBuildingForm() {
			this.createBuildingFormVisible = true;
		},
		clickCloseCreateBuildingForm() {
			this.createBuildingFormVisible = false;
		},
		clickOpenCreatePlotForm() {
			this.createBuildingFormVisible = true;
		},
		clickCloseCreatePlotForm() {
			this.createBuildingFormVisible = false;
		},
	}
};
</script>

<style lang="scss" scoped></style>
