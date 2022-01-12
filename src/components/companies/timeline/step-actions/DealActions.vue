<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2 pb-2" v-if="CURRENT_STEP_OBJECTS.length">
          <div class="col-12">
            <div class="timeline-actions row">
              <Deal
                :step="step"
                :disabled="disabled"
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
              :disabled="disabled"
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
import { MixinStepActions } from "../mixins";

export default {
  name: "DealActions",
  mixins: [MixinStepActions],
  components: {
    Objects,
    Deal,
  },
  props: {
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
    updatedObjects(data, fn) {
      this.$emit("updatedObjects", data, true, fn);
    },
  },
};
</script>

<style>
</style>