<template>
  <div class="objects">
    <OfferObjects
      v-if="selectedStep.number == 1"
      :currentStepObjects="CURRENT_STEP_OBJECTS"
      :allObjects="ALL_OBJECTS"
      :selectedObjects="selectedObjects"
      :loader="loader"
      :pagination="OBJECTS_PAGINATION"
      :favoritesVisible="favoritesVisible"
      @clickFavoritesVisibleToggle="clickFavoritesVisibleToggle"
      @selectObject="selectObject"
      @unSelectObject="unSelectObject"
      @clickResetSelectObjects="clickResetSelectObjects"
      @loadMore="loadMore"
      @sendObjects="sendObjects"
    />
  </div>
</template>

<script>
import OfferObjects from "@/components/companies/timeline/step-objects/OfferObjects.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Objects",
  components: {
    OfferObjects,
  },
  data() {
    return {
      loader: false,
      selectedObjects: [],
    };
  },
  props: {
    selectedStep: {
      type: [Object, Boolean],
    },
    favoritesVisible: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters([
      "OBJECTS_PAGINATION",
      "CURRENT_STEP_OBJECTS",
      "ALL_OBJECTS",
    ]),
  },
  methods: {
    ...mapActions([
      "FETCH_ALL_OBJECTS",
      "INCRIMENT_OBJECTS_CURRENT_PAGE",
      "RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST",
      "FETCH_CURRENT_STEP_OBJECTS",
      "FETCH_ALL_OBJECTS",
      "SEND_OBJECTS",
      "UPDATE_STEP",
    ]),
    selectObject(object) {
      this.selectedObjects.push(object);
    },
    unSelectObject(object) {
      this.selectedObjects = this.selectedObjects.filter(
        (item) => item.id != object.id
      );
    },
    loadMore() {
      console.warn("KASDA");
      this.INCRIMENT_OBJECTS_CURRENT_PAGE();
      this.FETCH_ALL_OBJECTS();
    },
    clickResetSelectObjects() {
      this.selectedObjects = [];
    },
    async sendObjects() {
      this.loader = true;
      let data = {
        ...this.selectedStep,
      };
      data.negative = 0;
      data.additional = 0;
      data.timelineStepObjects = [];
      this.selectedObjects.map((item) => {
        data.timelineStepObjects.push({
          timeline_step_id: data.id,
          object_id: item.original_id,
          type_id: item.type_id,
        });
      });
      if (await this.UPDATE_STEP(data)) {
        data.timelineStepObjects = data.timelineStepObjects.concat(
          this.selectedStep.timelineStepObjects
        );
        await this.FETCH_CURRENT_STEP_OBJECTS(data.timelineStepObjects);
        this.$emit("updated", data);

        this.clickResetSelectObjects();
        this.loader = false;
      }
    },
    async getCurrentStepObjects() {
      if (!this.selectedStep) {
        return;
      }
      this.loader = true;
      await this.FETCH_CURRENT_STEP_OBJECTS(
        this.selectedStep.timelineStepObjects
      );
      await this.FETCH_ALL_OBJECTS();
      this.loader = false;
    },
    clickFavoritesVisibleToggle() {
      this.$emit("clickFavoritesVisibleToggle");
    },
  },
  watch: {
    selectedStep(before, after) {
      if (before.id != after.id) {
        this.getCurrentStepObjects();
        this.clickResetSelectObjects();
        this.RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST();
      }
    },
    updatedFlag() {
      if (this.updatedFlag === false) {
        this.loader = false;
      } else {
        this.loader = true;
      }
    },
  },
  async created() {
    this.getCurrentStepObjects();
    console.log("AHUETb NE VSTATb");
  },
};
</script>

<style>
</style>