<template>
  <teleport to="body">
    <Modal class="autosize" @close="$emit('close')">
      <div class="letter-view-modal-wrapper">
        <LetterView :letter="letter" />
      </div>
    </Modal>
  </teleport>
</template>

<script>
import LetterView from "./LetterView";
import Mixin from "./mixin";
export default {
  emits: ["close"],
  name: "LetterViewModal",
  mixins: [Mixin],
  components: {
    LetterView,
  },
};
</script>

<style>
</style>