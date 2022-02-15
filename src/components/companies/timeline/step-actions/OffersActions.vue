<template>
  <div class="step-action">
    <teleport to="body">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__zoomIn for__modal"
        leave-active-class="animate__animated animate__zoomOut for__modal"
      >
        <Bar title="Избранное" v-if="barVisible">
          <Objects>
            <ObjectsList
              :objects="selectedObjects"
              :currentObjects="step.timelineStepObjects"
              :selectedObjects="selectedObjects"
              :disabled="true"
              :withSeparator="true"
              :loader="loader"
              col="col-6"
              label="Выбранные предложения"
              @select="select"
              @unSelect="unSelect"
              @addComment="addComment"
            />
          </Objects>
        </Bar>
      </transition>
    </teleport>
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
                @favorites="favorites"
                @changeViewMode="changeViewMode"
                @openExtraVisible="openExtraVisible"
                @closeExtraVisible="closeExtraVisible"
                ref="contoll_panel"
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
              <ObjectsSearch
                @search="search"
                class="mb-2"
                :class="{ 'action-open': controllPanelHeight > 50 }"
              />
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
import Bar from "@/components/Bar";
export default {
  name: "OffersActions",
  mixins: [MixinStepActions, MixinAllObject],
  components: {
    Bar,
  },
  methods: {
    updatedObjects(data, fn) {
      this.barVisible = false;
      this.$emit("updatedObjects", data, true, fn);
    },
    openExtraVisible() {
      this.$nextTick(() => {
        this.controllPanelHeight = this.$refs.contoll_panel.$el.clientHeight;
      });
    },
    closeExtraVisible() {
      this.$nextTick(() => {
        this.controllPanelHeight = this.$refs.contoll_panel.$el.clientHeight;
      });
    },
  },
};
</script>

<style>
</style>