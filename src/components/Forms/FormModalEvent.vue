<template>
    <teleport to="body">
        <Modal @close="$emit('close')" class="autosize" title="Создание события">
            <FormEvent
                @created="(...argv) => $emit('created', ...argv)"
                @updated="(...argv) => $emit('updated', ...argv)"
                :formdata="formdata"
            />
        </Modal>
    </teleport>
</template>

<script>
import Modal from '@/components/common/Modal.vue';
import FormEvent from '@/components/Forms/FormEvent.vue';

export default {
    name: 'FormModalEvent',
    components: {
        FormEvent,
        Modal
    },
    emits: ['close', 'updated', 'created'],
    props: {
        formdata: {
            type: Object
        }
    }
};
</script>

<style></style>
