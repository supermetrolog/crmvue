<template>
  <div class="accordion row no-gutters">
    <slot />
  </div>
</template>

<script>
import { reactive, provide, onMounted, watch } from "vue";

export default {
  name: "Accordion",
  props: {
    defaultTabHash: {
      type: Number,
      required: false,
    },
  },
  setup(props, context) {
    const state = reactive({
      activeTabHash: "",
      tabs: [],
    });

    provide("tabsProvider", state);
    provide("addTab", (tab) => {
      state.tabs.push(tab);
    });
    provide("updateTab", (computedId, data) => {
      let tabIndex = state.tabs.findIndex(
        (tab) => tab.computedId === computedId
      );
      data.isActive = state.tabs[tabIndex].isActive;
      state.tabs[tabIndex] = data;
    });
    provide("deleteTab", (computedId) => {
      let tabIndex = state.tabs.findIndex(
        (tab) => tab.computedId === computedId
      );
      state.tabs.splice(tabIndex, 1);
    });
    const selectTab = (selectedTabHash, event) => {
      if (state.activeTabHash == selectedTabHash) {
        state.activeTabHash = null;
        return;
      }
      const selectedTab = findTab(selectedTabHash);
      if (!selectedTab) {
        return;
      }
      if (event && selectedTab.disabled) {
        event.preventDefault();
        return;
      }
      state.tabs.forEach((tab) => {
        tab.isActive = tab.hash === selectedTab.hash;
      });
      context.emit("changed", { tab: selectedTab });
      state.activeTabHash = selectedTab.hash;
    };

    const findTab = (hash) => {
      return state.tabs.find((tab) => tab.hash === hash);
    };
    provide("selectTab", (selectedTabHash, event) =>
      selectTab(selectedTabHash, event)
    );
    onMounted(() => {
      if (!state.tabs.length) {
        return;
      }
      if (props.defaultTabHash && findTab("#" + props.defaultTabHash)) {
        selectTab("#" + props.defaultTabHash);
        return;
      }
      selectTab(state.tabs[0].hash);
    });
    watch(
      () => Object.assign({}, props),
      () => {
        selectTab("#" + props.defaultTabHash);
      }
    );
  },
};
</script>

<style>
</style>