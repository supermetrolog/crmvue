<template>
    <UiDropdownActions>
        <template #trigger>
            <UiButtonIcon
                small
                label="Управление папками"
                icon="fa-solid fa-folder-open"
                class="mx-auto"
                :class="buttonClass"
                :badge="entityFoldersCount"
                badge-color="dark"
                :color="buttonColor"
            />
        </template>
        <template #menu>
            <UiDropdownActionsButton v-if="isLoading" loading label="Загрузка папок.." />
            <UiDropdownActionsButton
                v-else-if="!folders.length"
                disabled
                icon="fa-solid fa-ban"
                label="Список папок пуст.."
            />
            <UiDropdownActionsButton
                v-for="folder in folders"
                :key="folder.id"
                @handle="handleFolder(folder)"
                :label="`${folder.name}`"
                :active="entityFoldersSet.has(folder.id)"
                :close-on-click="false"
            >
                <template #icon>
                    <i :class="folder.icon" :style="{ color: `#${folder.color}` }" />
                </template>
                <template #after>
                    <i
                        class="fa-solid ml-auto fs-2"
                        :class="entityFoldersSet.has(folder.id) ? 'fa-minus' : 'fa-plus'"
                    />
                </template>
            </UiDropdownActionsButton>
        </template>
        <!--        <template #footer>-->
        <!--            <UiDropdownActionsButton-->
        <!--                @handle="createFolder"-->
        <!--                label="Создать папку"-->
        <!--                icon="fa-solid fa-plus"-->
        <!--                :close-on-click="false"-->
        <!--            />-->
        <!--        </template>-->
    </UiDropdownActions>
</template>
<script setup>
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import { useUserFolderEntities } from '@/composables/useUserFolderEntities.js';

const emit = defineEmits(['deleted-from-folder']);
const props = defineProps({
    morph: {
        type: String,
        required: true
    },
    entity: {
        type: Number,
        required: true
    },
    creatable: Boolean,
    buttonClass: [String, Array, Object],
    buttonColor: String
});

const { isLoading, entityFoldersSet, entityFoldersCount, folders, addToFolder, removeFromFolder } =
    useUserFolderEntities(props.morph, props.entity);

async function handleFolder(folder) {
    if (entityFoldersSet.value.has(folder.id)) {
        const deleted = await removeFromFolder(folder.id);
        if (deleted) emit('deleted-from-folder', folder.id);
    } else {
        addToFolder(folder.id);
    }
}

// TODO: Сделать вариант "Создать папку" в самом низу списка
</script>
