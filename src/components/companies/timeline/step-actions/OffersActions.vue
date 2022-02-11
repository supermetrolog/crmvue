<template>
  <div class="step-action">
    <div class="row no-gutters inner scroller">
      <div class="col-12">
        <div class="row px-2">
          <div class="col-6">
            <div class="timeline-actions row"></div>
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
                label="Отправленные предложения"
                @select="select"
                @unSelect="unSelect"
                @addComment="addComment"
              />
              <ObjectsSearch @search="search" class="mb-2" />
              <ObjectsList
                :objects="allObjects"
                :currentObjects="step.timelineStepObjects"
                :selectedObjects="selectedObjects"
                :disabled="disabled"
                :loader="allObjectsLoader"
                @select="select"
                @unSelect="unSelect"
                @addComment="addComment"
              />
              <Pagination
                :pagination="pagination"
                @loadMore="loadMore"
                class="text-center"
              />
            </Objects>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MixinStepActions } from "../mixins";
import { MixinAllObject } from "../../objects-new/mixins";

export default {
  name: "OffersActions",
  mixins: [MixinStepActions, MixinAllObject],
  methods: {
    updatedObjects(data, fn) {
      this.$emit("updatedObjects", data, true, fn);
    },
  },
};
</script>

<style>
</style>