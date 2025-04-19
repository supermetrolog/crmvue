<template>
    <div>
        <div v-if="isLoading" class="d-flex gap-2 user-folders">
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
            <template #footer>
                <UiField v-if="!folders.length" color="light">Список папок пуст..</UiField>
                <div v-if="editable || selectedFolder" class="d-flex align-items-center gap-2 ml-2">
                    <span class="text-grey"> | </span>
                    <AnimationTransition :speed="0.4">
                        <UiButton
                            v-if="selectedFolder"
                            @click="selectFolder(null)"
                            color="light"
                            small
                        >
                            <i class="fa-solid fa-xmark text-grey" />
                        </UiButton>
                    </AnimationTransition>
                    <UiButton
                        v-if="editable"
                        @click="createFolder"
                        icon="fa-solid fa-folder-plus text-grey"
                        color="light"
                        small
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
                @deleted="onDeleteFolder"
                :morph
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

const selectedFolder = defineModel('selected', { type: Number });

const emit = defineEmits(['select']);
const props = defineProps({
    morph: {
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

const { folders, isLoading, updateOrder, deleteFolder } = useUserFolders(props.morph);

// create

const formIsVisible = ref(false);
const editingFolder = shallowRef(null);

function createFolder() {
    formIsVisible.value = true;
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

function onDeleteFolder() {
    deleteFolder(editingFolder.value.id);
    if (selectedFolder.value === editingFolder.value.id) selectedFolder.value = null;
}
</script>
