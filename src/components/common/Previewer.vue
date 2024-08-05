<template>
    <Modal @close="toggle" :show="opened" class="modal-previewer" title="Просмотр изображения">
        <div class="previewer">
            <VLazyImage :src="image" alt="image preview" />
        </div>
    </Modal>
</template>
<script>
import Modal from '@/components/common/Modal.vue';
import VLazyImage from 'v-lazy-image';
export default {
    name: 'Previewer',
    components: { Modal, VLazyImage },
    data() {
        return {
            opened: false,
            image: null
        };
    },
    methods: {
        toggle(image = null) {
            this.image = image;
            this.opened = !this.opened;
        }
    }
};
</script>
