<template>
    <Modal @close="$emit('close')" show :title="title" :width="1200">
        <Spinner v-if="isLoading" />
        <LetterView v-else :letter="letter" />
    </Modal>
</template>

<script>
import LetterView from './LetterView.vue';
import Modal from '@/components/common/Modal.vue';
import api from '@/api/api.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';

export default {
    name: 'LetterViewModal',
    components: {
        Spinner,
        Modal,
        LetterView
    },
    emits: ['close'],
    props: {
        letterID: {
            type: Number,
            required: true
        }
    },
    setup() {
        const { isLoading } = useDelayedLoader();
        return { isLoading };
    },
    data() {
        return {
            letter: null
        };
    },
    computed: {
        title() {
            if (!this.letter) return `Письмо #${this.letterID}`;
            return `Письмо #${this.letter.id}. ${this.letter.subject}`;
        }
    },
    async created() {
        this.isLoading = true;
        this.letter = await api.letter.get(this.letterID);
        this.isLoading = false;
    }
};
</script>
