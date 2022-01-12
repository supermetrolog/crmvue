<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2 pb-2" v-if="CURRENT_STEP_OBJECTS.length">
          <div class="col-12">
            <div class="timeline-actions row">
              <Deal
                :step="step"
                :request_id="+requestId"
                :loaderForStep="loaderForStep"
                @updateItem="clickUpdateStep"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <Objects
              :step="step"
              @updated="updatedObjects"
              @updateItem="clickUpdateStep"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Objects from "../../objects/Objects.vue";
import { mapGetters } from "vuex";
import Deal from "../steps/Deal.vue";

export default {
  name: "DealActions",
  components: {
    Objects,
    Deal,
  },
  props: {
    step: {
      type: [Object, Boolean],
    },
    loaderForStep: {
      type: [Number, Boolean],
    },
  },
  computed: {
    ...mapGetters(["CURRENT_STEP_OBJECTS"]),
    requestId() {
      return this.$route.query.request_id;
    },
  },
  methods: {
    clickUpdateStep(data, flag, fn) {
      this.$emit("updateStep", data, flag, fn);
    },
    updatedObjects(data, fn) {
      this.$emit("updatedObjects", data, true, fn);
    },
  },
  emits: ["updateStep", "updatedObjects"],
};
</script>

<style>
</style>