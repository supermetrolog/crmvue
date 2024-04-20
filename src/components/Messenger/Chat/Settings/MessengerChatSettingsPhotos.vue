<template>
    <div class="messenger-chat-settings-window modal active">
        <div class="modal__container">
            <div class="modal__header">
                <p>Список фотографий</p>
                <div class="modal__close">
                    <i
                        v-tippy="'Закрыть окно'"
                        @click.prevent="$emit('close')"
                        class="icon fa-solid fa-xmark"
                    ></i>
                </div>
            </div>
            <div class="modal__body">
                <div class="messenger-chat-settings-window__content">
                    <Spinner v-if="isLoading" center class="spinner--green" />
                    <FileList v-else-if="photos.length" :files="photos" class="file-list--images" />
                    <EmptyData v-else>Список фотографий пуст..</EmptyData>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import FileList from '@/components/common/FileList.vue';

export default {
    name: 'MessengerChatSettingsPhotos',
    components: { FileList, EmptyData, Spinner },
    emits: ['close'],
    data() {
        return {
            isLoading: false,
            photos: []
        };
    },
    methods: {
        async fetchPhotos() {
            this.isLoading = true;

            this.photos = await this.$store.dispatch('Messenger/getCurrentChatPhotos');

            this.isLoading = false;
        }
    },
    created() {
        this.fetchPhotos();
    }
};
</script>
