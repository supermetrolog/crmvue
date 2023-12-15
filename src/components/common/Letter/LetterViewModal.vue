<template>
    <teleport to="body">
        <Modal @close="$emit('close')" class="autosize" title="Письмо">
            <div class="letter-view-modal-wrapper">
                <LetterView :letter="letter" />
            </div>
        </Modal>
    </teleport>
</template>

<script>
import LetterView from './LetterView.vue';
import Modal from '@/components/common/Modal.vue';

export default {
    name: 'LetterViewModal',
    components: {
        Modal,
        LetterView
    },
    emits: ['close'],
    props: {
        letter: {
            type: Object,
            required: true
        }
    }
};
</script>

<style></style>