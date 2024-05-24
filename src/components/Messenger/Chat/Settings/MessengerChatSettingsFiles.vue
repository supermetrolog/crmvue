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
                    <FileList v-else-if="files.length" :files="files" class="col-12" />
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

export default {
    name: 'MessengerChatSettingsFiles',
    components: { EmptyData, FileList, Spinner },
    emits: ['close'],
    data() {
        return {
            isLoading: false,
            files: []
        };
    },
    methods: {
        async fetchFiles() {
            this.isLoading = true;

            this.files = await this.$store.dispatch('Messenger/getCurrentChatFiles');

            this.isLoading = false;
        }
    },
    created() {
        this.fetchFiles();
    }
};
</script>
