<template>
    <teleport to="body">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <Modal @close="$emit('close')" class="autosize" title="Создание события">
                <FormEvent
                    @created="(...argv) => this.$emit('created', ...argv)"
                    @updated="(...argv) => this.$emit('updated', ...argv)"
                    :formdata="formdata"
                />
            </Modal>
        </transition>
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