<template>
    <div>
        <div v-if="isLoading || isDeleting" class="d-flex gap-2 user-folders">
            <UserFolderSkeleton v-for="key in 3" :key="key" />
        </div>
        <VirtualDragList
            v-else
            v-model="folders"
            @drop="onDropFolder"
            @drag="onDragFolder"
            :handle="handleDrag"
            group="folders"
            data-key="id"
            :keeps="20"
            lockAxis="y"
            :disabled="!movable"
            :sortable="movable"
            placeholder-class="placeholder"
            ghost-class="ghost"
            chosen-class="chosen"
            wrap-class="d-flex gap-2 flex-wrap user-folders"
            class="d-flex"
        >
            <template #item="{ record }">
                <Dropdown trigger="contextmenu" block>
                    <template #trigger>
                        <UserFolder
                            @click="selectFolder(record.id)"
                            @enable-sort="onEnableSort(record.id)"
                            @disable-sort="onDisableSort(record.id)"
                            @edit="editFolder(record)"
                            :folder="record"
                            :movable="movable && !isActiveDrag"
                            :dragging="isActiveDrag && activeDragKey === record.id"
                            :active="selectedFolder === record.id"
                            editable
                        />
                    </template>
                    <template #default>
                        <DropdownContent>
                            <div class="d-flex flex-column">
                                <UserFolder :folder="record" disabled />
                                <UiDropdownActionsButton
                                    @handle="editFolder(record)"
                                    icon="fa-solid fa-pen"
                                    label="Редактировать"
                                />
                                <UiDropdownActionsButton
                                    @handle="handleClearFolder(record)"
                                    icon="fa-solid fa-folder-minus"
                                    label="Очистить папку"
                                />
                                <UiDropdownActionsButton
                                    @handle="handleDeleteFolder(record.id)"
                                    icon="fa-solid fa-trash"
                                    label="Удалить папку"
                                />
                            </div>
                        </DropdownContent>
                    </template>
                </Dropdown>
            </template>
            <template #footer>
                <UiField v-if="!folders.length" color="light">Список папок пуст..</UiField>
                <div v-if="editable || selectedFolder" class="d-flex align-items-center gap-2 ml-2">
                    <span class="text-grey"> | </span>
                    <AnimationTransition :speed="0.4">
                        <UiButton
                            v-if="selectedFolder"
                            @click="selectFolder(null)"
                            color="light"
                            icon="fa-solid fa-xmark"
                            small
                        >
                            Закрыть папку
                        </UiButton>
                    </AnimationTransition>
                    <UiButton
                        v-if="editable"
                        @click="createFolder"
                        icon="fa-solid fa-folder-plus text-grey"
                        color="light"
                        small
                        class="flex-shrink-0"
                    >
                        Новая папка
                    </UiButton>
                </div>
            </template>
        </VirtualDragList>
        <teleport to="body">
            <FormUserFolder
                v-if="formIsVisible"
                @close="closeForm"
                @updated="onUpdateFolder"
                @created="onCreateFolder"
                @deleted="onDeleteFolder(editingFolder.id)"
                :category
                :form-data="editingFolder"
            />
        </teleport>
    </div>
</template>
<script setup>
import UserFolder from '@/components/UserFolder/UserFolder.vue';
import VirtualDragList from 'vue-virtual-draglist';
import { computed, ref, shallowRef } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useUserFolders } from '@/composables/useUserFolders.js';
import FormUserFolder from '@/components/Forms/FormUserFolder.vue';
import UiField from '@/components/common/UI/UiField.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UserFolderSkeleton from '@/components/UserFolder/UserFolderSkeleton.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { Dropdown, DropdownContent } from 'v-dropdown';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import api from '@/api/api.js';
import { useAsync } from '@/composables/useAsync.js';
import { useConfirm } from '@/composables/useConfirm.js';

const FOLDERS_COUNT_LIMIT = 10;

const selectedFolder = defineModel('selected', { type: Number });

const emit = defineEmits(['select']);
const props = defineProps({
    category: {
        type: String,
        required: true
    },
    movable: Boolean,
    editable: Boolean,
    selectable: Boolean
});

const isActiveDrag = ref(false);
const activeDragKey = ref(null);

function onDropFolder(event) {
    isActiveDrag.value = false;
    activeDragKey.value = null;

    if (event.newIndex !== event.oldIndex) {
        updateOrder();
    }
}

function onDragFolder({ key }) {
    isActiveDrag.value = true;
    activeDragKey.value = key;
}

function onDisableSort(key) {
    elementsWithEnabledSort.value.delete(key);
}

function onEnableSort(key) {
    elementsWithEnabledSort.value.add(key);
}

const elementsWithEnabledSort = ref(new Set());
const sortIsEnabled = computed(() => elementsWithEnabledSort.value.size > 0);

function handleDrag() {
    return sortIsEnabled.value;
}

function selectFolder(key) {
    if (props.selectable) {
        if (key === selectedFolder.value) selectedFolder.value = null;
        else selectedFolder.value = key;
    } else {
        emit('select', key);
    }
}

const { folders, isLoading, updateOrder, deleteFolder, clearFolder } = useUserFolders(
    props.category
);

// create

const formIsVisible = ref(false);
const editingFolder = shallowRef(null);

const notify = useNotify();

function createFolder() {
    if (folders.value.length < FOLDERS_COUNT_LIMIT) {
        formIsVisible.value = true;
    } else {
        notify.info(`Достигнут лимит количества папок (${FOLDERS_COUNT_LIMIT}) в категории.`);
    }
}

function onCreateFolder(folder) {
    closeForm();
    folders.value.unshift(folder);
}

function editFolder(folder) {
    editingFolder.value = folder;
    formIsVisible.value = true;
}

function onUpdateFolder(folder) {
    const index = folders.value.findIndex(f => f.id === folder.id);
    if (index !== -1) Object.assign(folders.value[index], folder);
}

function closeForm() {
    formIsVisible.value = false;
    editingFolder.value = null;
}

function onDeleteFolder(folderId) {
    deleteFolder(folderId);
    if (selectedFolder.value === folderId) selectedFolder.value = null;
}

const { isLoading: isDeleting, execute: handleDeleteFolder } = useAsync(api.folder.delete, {
    onFetchResponse: ({ args }) => {
        notify.success('Папка успешно удалена.');
        onDeleteFolder(args[0]);
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить папку',
        message: 'Вы уверены, что хотите удалить папку? Удаленную папку нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const { confirm } = useConfirm();

async function handleClearFolder(folder) {
    const confirmed = await confirm({
        title: 'Очистить папку',
        message:
            'Все объекты, привязанные к папке, будут откреплены от нее. Это действие нельзя отменить',
        okButton: 'Очистить'
    });

    if (!confirmed) return;

    await api.folder.clear(folder.id);
    notify.success('Папка успешно очищена.');

    clearFolder(folder.id);
}
</script>
