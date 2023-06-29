<template>
  <div class="ObjectHoldings">
    <div class="ObjectHoldings-header">
      <p>СТРОЕНИЯ ({{ buildingsCount }}), УЧАСТКИ ({{ landsCount }})</p>
      <div class="ObjectHoldings-header-icons">
        <button class="ObjectHoldings-header-button" @click="clickOpenCreateBuildingForm">
          <i class="fas fa-warehouse"></i>
        </button>
        <button class="ObjectHoldings-header-button">
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
import BuildingCreateForm from "@/components/complex/object-holdings/building-create-form/BuildingCreateForm.vue";

export default {
  name: "ObjectHoldings",
  components: {BuildingCreateForm, ObjectHolding },
  props: {
		objects: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
			createBuildingFormVisible: false
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
	}
};
</script>

<style lang="scss" scoped></style>
