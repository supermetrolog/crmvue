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
                    <Spinner v-if="isLoading" center />
                    <FileList
                        v-else-if="photos.length"
                        @load="loadPhotos"
                        :files="photos"
                        class="file-list--images"
                    />
                    <EmptyData v-else>Список фотографий пуст..</EmptyData>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import FileList from '@/components/common/FileList.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useStore } from 'vuex';
import { useInfiniteLoading } from '@/composables/useInfiniteLoading.js';

defineEmits(['close']);

const store = useStore();
const getCurrentChatPhotos = page => store.dispatch('Messenger/getCurrentChatPhotos', page);

const { isLoading } = useDelayedLoader();
const { load: loadPhotos, items: photos, pagination } = useInfiniteLoading(getCurrentChatPhotos);

const fetchPhotos = async () => {
    isLoading.value = true;
    const data = await getCurrentChatPhotos();

    if (data) {
        photos.value = data.data;
        pagination.value = data.pagination;
    }

    isLoading.value = false;
};

fetchPhotos();
</script>
