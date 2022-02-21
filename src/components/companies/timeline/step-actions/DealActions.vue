<template>
  <div class="step-actions">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2 pb-2" v-if="step.timelineStepObjects.length">
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
            <Objects>
              <ObjectsControllPanel
                :viewMode="viewMode"
                :buttons="buttons"
                @reset="reset"
                @done="done"
                @send="send"
                @negative="negative"
                @changeViewMode="changeViewMode"
              />
              <ObjectsList
                :objects="preventStepObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :withSeparator="true"
                :loader="loader"
                :viewMode="viewMode"
                @select="selectOnlyOne"
                @unSelect="unSelect"
                @addComment="addComment"
              />
            </Objects>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Objects from "../../objects/Objects.vue";
import { mapActions, mapGetters } from "vuex";
import Deal from "../steps/Deal.vue";
import { MixinStepActions } from "../mixins";
import { MixinObject } from "../../objects-new/mixins";

export default {
  name: "DealActions",
  mixins: [MixinStepActions, MixinObject],
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
    ...mapActions(["FETCH_COMPANY_REQUESTS"]),
    updatedObjects(data, fn) {
      const fetchRequest = () => {
        this.FETCH_COMPANY_REQUESTS(this.$route.params.id);
        fn();
      };
      this.$emit("updatedObjects", data, true, fetchRequest);
    },
  },
};
</script>

<style>
</style>