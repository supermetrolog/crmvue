<template>
  <div class="caller-manager">
    <div class="row no-gutters caller-manager__container">
      <div class="col-10 all-info">
        <CallerManagerIncomingItem
          v-if="activeItem && activeItem.type == 1"
          :call="activeItem"
        />
        <CallerManagerOutcomingItem
          v-if="activeItem && activeItem.type == 0"
          :call="activeItem"
        />
      </div>
      <div class="col-1"></div>
      <div class="col-1 list">
        <CallerManagerList
          @clickItem="clickItem"
          @updateItem="updateItem"
          :activeItem="activeItem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CallerManagerIncomingItem from "./caller-info/CallerManagerIncomingItem.vue";
import CallerManagerOutcomingItem from "./caller-info/CallerManagerOutcomingItem.vue";
import CallerManagerList from "./CallerManagerList.vue";
export default {
  name: "CallerManager",
  components: {
    CallerManagerIncomingItem,
    CallerManagerOutcomingItem,
    CallerManagerList,
  },
  data() {
    return {
      activeItem: null,
    };
  },

  methods: {
    clickItem(call) {
      console.log(call);
      if (this.activeItem == call) {
        this.activeItem = null;
      } else {
        this.activeItem = call;
      }
    },
    updateItem(call) {
      this.activeItem = call;
    },
  },
};
</script>

<style>
</style>