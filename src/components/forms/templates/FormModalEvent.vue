<template>
    <teleport to="body">
        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__zoomIn for__modal absolute"
            leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
            <Modal class="autosize" @close="$emit('close')" title="Создание события">
                <FormEvent
                    :formdata="formdata"
                    @created="(...argv) => this.$emit('created', ...argv)"
                    @updated="(...argv) => this.$emit('updated', ...argv)"
                />
            </Modal>
        </transition>
    </teleport>
</template>

<script>
import EventForm from "./FormEvent.vue";
import Modal from "@/components/common/Modal.vue";
import FormEvent from "@/components/forms/templates/FormEvent.vue";

export default {
    emits: ["close", "updated", "created"],
    name: "FormModalEvent",
    components: {
        FormEvent,
        Modal,
        EventForm,
    },
    props: {
        formdata: {
            type: Object,
        },
    },
};
</script>

<style>
</style>