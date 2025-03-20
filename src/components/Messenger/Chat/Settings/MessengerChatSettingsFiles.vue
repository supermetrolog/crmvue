<template>
    <div class="messenger-chat-settings-window modal active">
        <div class="modal__container">
            <div class="modal__header">
                <p>Список файлов</p>
                <div class="modal__close">
                    <UiTooltipIcon
                        @click.prevent="$emit('close')"
                        tooltip="Закрыть окно"
                        icon="fa-solid fa-xmark"
                        class="icon"
                    />
                </div>
            </div>
            <div class="modal__body">
                <div class="messenger-chat-settings-window__content">
                    <Spinner v-if="isLoading" center />
                    <FileList
                        v-else-if="files.length"
                        @load="loadFiles"
                        :files="files"
                        class="col-12"
                    />
                    <EmptyData v-else class="col-12">Список файлов пуст..</EmptyData>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Spinner from '@/components/common/Spinner.vue';
import FileList from '@/components/common/FileList.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { useStore } from 'vuex';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useInfiniteLoading } from '@/composables/useInfiniteLoading.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';

defineEmits(['close']);

const store = useStore();
const getCurrentChatFiles = page => store.dispatch('Messenger/getCurrentChatFiles', page);

const { isLoading } = useDelayedLoader();
const { load: loadFiles, items: files, pagination } = useInfiniteLoading(getCurrentChatFiles);

const fetchFiles = async () => {
    isLoading.value = true;
    const data = await getCurrentChatFiles();

    if (data) {
        files.value = data.data;
        pagination.value = data.pagination;
    }

    isLoading.value = false;
};

fetchFiles();
</script>
