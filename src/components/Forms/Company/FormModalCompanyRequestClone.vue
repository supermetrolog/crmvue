<template>
    <Modal class="autosize" title="Клонирование запроса" @close="$emit('close')">
        <FormCompanyRequestClone :request="request" @cloned="$emit('cloned')"/>
    </Modal>
</template>

<script>
import Modal from "@/components/common/Modal.vue";
import FormCompanyRequestClone from "@/components/Forms/Company/FormCompanyRequestClone.vue";

export default {
    name: "FormModalCompanyRequestClone",
    components: {
        FormCompanyRequestClone,
        Modal
    },
    props: {
        request: {
            type: Object,
            required: true
        }
    }
};
</script>

<style>
</style>