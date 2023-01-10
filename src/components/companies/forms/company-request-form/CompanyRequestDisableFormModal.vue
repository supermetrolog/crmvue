<template>
  <div class="company-request-disable-form-modal">
    <Modal class="autosize" :title="title" @close="$emit('close')">
      <CompanyRequestDisableForm
        @disabled="$emit('disabled')"
        :request_id="request_id"
      />
    </Modal>
  </div>
</template>

<script>
import CompanyRequestDisableForm from "./CompanyRequestDisableForm";
export default {
  emits: ["close", "disabled"],
  name: "CompanyRequestDisableFormModal",
  components: {
    CompanyRequestDisableForm,
  },
  props: {
    title: {
      type: String,
      default: "Завершения запроса",
    },
    request_id: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.company-request-disable-form-modal {
  .modal-body {
    max-width: 350px;
    min-width: 350px;
  }
}
</style>