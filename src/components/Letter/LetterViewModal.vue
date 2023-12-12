<template>
    <teleport to="body">
        <Modal class="autosize" @close="$emit('close')" title="Письмо">
            <div class="letter-view-modal-wrapper">
                <LetterView :letter="letter"/>
            </div>
        </Modal>
    </teleport>
</template>

<script>
import LetterView from "./LetterView.vue";
import Modal from "@/components/common/Modal.vue";

export default {
    emits: ["close"],
    name: "LetterViewModal",
    components: {
        Modal,
        LetterView,
    },
    props: {
        letter: {
            type: Object,
            required: true
        }
    }
};
</script>

<style>
</style>