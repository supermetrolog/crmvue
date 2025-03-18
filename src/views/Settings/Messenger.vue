<template>
    <div class="container-fluid">
        <Teleport to="body">
            <FormMessengerTag
                v-if="tagFormIsVisible"
                @close="closeTagForm"
                @updated="onTagUpdated"
                @created="onTagCreated"
                @deleted="fetchTags"
                :form-data="editingTag"
            />
        </Teleport>
        <div class="row">
            <div class="col-12">
                <DashboardCard>
                    <template #header>
                        <SettingsFormHeader
                            @add="tagFormIsVisible = true"
                            @load="loadTags"
                            @refresh="fetchTags"
                            title="Управление тегами в чате"
                            :size="tags.length"
                            :pagination="tagsPagination"
                        >
                            <template #extra>
                                <DashboardChip
                                    @click="refreshTags"
                                    class="settings-form__button settings-form__button--info"
                                    :class="{ disabled: refreshIsLoading }"
                                >
                                    <i class="fa-solid fa-rotate" />
                                    <span class="ml-1">Обновить тэги в чате</span>
                                </DashboardChip>
                            </template>
                        </SettingsFormHeader>
                    </template>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <Loader v-if="tagsIsLoading" small />
                        <SettingsFormElement
                            v-for="tag in tags"
                            :key="tag.id"
                            @delete="deleteTag(tag)"
                            @edit="editTag(tag)"
                            :is-deleted="tag.deleted_at !== null"
                            :element="tag"
                            can-edit
                        >
                            <template #text="{ item }">
                                <span class="mr-1">#{{ item.id }}</span>
                                <span>{{ item.name }}</span>
                            </template>
                        </SettingsFormElement>
                    </div>
                </DashboardCard>
            </div>
        </div>
    </div>
</template>
<script setup>
import SettingsFormHeader from '@/components/Settings/SettingsFormHeader.vue';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import Loader from '@/components/common/Loader.vue';
import SettingsFormElement from '@/components/Settings/SettingsFormElement.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { ref, shallowRef } from 'vue';
import api from '@/api/api.js';
import FormMessengerTag from '@/components/Forms/FormMessengerTag.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { useStore } from 'vuex';

const notify = useNotify();
const { confirm } = useConfirm();
const store = useStore();

const { isLoading: tagsIsLoading } = useDelayedLoader();
const { isLoading: refreshIsLoading } = useDelayedLoader();
const tags = ref([]);
const tagsPagination = ref(null);
const editingTag = ref(null);
const tagFormIsVisible = shallowRef(false);

const closeTagForm = () => {
    tagFormIsVisible.value = false;
    editingTag.value = null;
};

const fetchTags = async (page = 1) => {
    tagsIsLoading.value = true;

    const response = await api.messengerTag.list(page);
    if (response) {
        tags.value = response.data;
        tagsPagination.value = response.pagination;
    }

    tagsIsLoading.value = false;
};

const loadTags = async () => {
    const response = await api.messengerTag.list(tagsPagination.value.currentPage + 1);

    if (response) {
        tags.value.push(...response.data);
        tagsPagination.value = response.pagination;
    }
};

const deleteTag = async tag => {
    const confirmed = await confirm(
        'Удалить тэг',
        `Вы действительно хотите удалить Тэг "#${tag.id} ${tag.name}"?`
    );
    if (!confirmed) return;

    const deleted = await api.messengerTag.delete(tag.id);
    if (deleted) {
        notify.success('Тэг успешно удален.');
        await fetchTags();
    }
};

const editTag = tag => {
    editingTag.value = tag;
    tagFormIsVisible.value = true;
};

const onTagCreated = () => {
    closeTagForm();
    fetchTags();
};

const onTagUpdated = tag => {
    const fieldElement = tags.value.find(element => element.id === tag.id);
    if (fieldElement) Object.assign(fieldElement, tag);

    closeTagForm();
    fetchTags();
};

const refreshTags = () => {
    refreshIsLoading.value = true;
    store.dispatch('Messenger/refreshTags');
    refreshIsLoading.value = false;
};

fetchTags();
</script>
