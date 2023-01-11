<template>
  <Modal class="autosize" title="Клонирование запроса" @close="$emit('close')">
    <CompanyRequestCloneForm :request="request" @cloned="$emit('cloned')" />
  </Modal>
</template>

<script>
import CompanyRequestCloneForm from "./CompanyRequestCloneForm";
import Mixin from "./mixin";
export default {
  name: "CompanyRequestCloneFormModal",
  mixins: [Mixin],
  components: {
    CompanyRequestCloneForm,
  },
};
</script>

<style>
</style>