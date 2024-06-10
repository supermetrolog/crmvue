<template>
    <div class="messenger-chat-settings-window modal active">
        <div class="modal__container">
            <div class="modal__header">
                <p>Список файлов</p>
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
<script>
import Spinner from '@/components/common/Spinner.vue';
import FileList from '@/components/common/FileList.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import { useStore } from 'vuex';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useInfiniteLoading } from '@/composables/useInfiniteLoading.js';

export default {
    name: 'MessengerChatSettingsFiles',
    components: { EmptyData, FileList, Spinner },
    emits: ['close'],
    setup() {
        const store = useStore();
        const getCurrentChatFiles = page => store.dispatch('Messenger/getCurrentChatFiles', page);

        const { isLoading } = useDelayedLoader();
        const {
            load: loadFiles,
            items: files,
            pagination
        } = useInfiniteLoading(getCurrentChatFiles);

        return { isLoading, loadFiles, files, pagination, getCurrentChatFiles };
    },
    methods: {
        async fetchFiles() {
            this.isLoading = true;
            const data = await this.getCurrentChatFiles();

            this.files = data.data;
            this.pagination = data.pagination;

            this.isLoading = false;
        }
    },
    created() {
        this.fetchFiles();
    }
};
</script>
