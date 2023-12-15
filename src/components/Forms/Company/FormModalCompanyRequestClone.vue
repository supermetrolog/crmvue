<template>
    <Modal @close="$emit('close')" class="autosize" title="Клонирование запроса">
        <FormCompanyRequestClone @cloned="$emit('cloned')" :request="request" />
    </Modal>
</template>

<script>
import Modal from '@/components/common/Modal.vue';
import FormCompanyRequestClone from '@/components/Forms/Company/FormCompanyRequestClone.vue';

export default {
    name: 'FormModalCompanyRequestClone',
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

<style></style>