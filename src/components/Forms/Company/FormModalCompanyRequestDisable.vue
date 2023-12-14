<template>
    <div class="company-request-disable-form-modal">
        <Modal class="autosize" :title="title" @close="$emit('close')">
            <FormCompanyRequestDisable
                @disabled="$emit('disabled')"
                :request_id="request_id"
            />
        </Modal>
    </div>
</template>

<script>
import Modal from "@/components/common/Modal.vue";
import FormCompanyRequestDisable from "@/components/Forms/Company/FormCompanyRequestDisable.vue";

export default {
    emits: ["close", "disabled"],
    name: "FormModalCompanyRequestDisable",
    components: {
        FormCompanyRequestDisable,
        Modal
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