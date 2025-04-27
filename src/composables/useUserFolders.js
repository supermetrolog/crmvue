import { computed } from 'vue';
import { useStore } from 'vuex';
import { createSharedComposable } from '@vueuse/core';
import api from '@/api/api.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

function createSharedFolders(morph) {
    const store = useStore();

    const isLoading = computed(() => store.state.Folder[morph].loading);

    const folders = computed({
        get() {
            return store.state.Folder[morph].folders;
        },
        set(value) {
            store.state.Folder[morph].folders = value;
        }
    });

    if (!store.state.Folder[morph].loaded) {
        store.dispatch('Folder/fetchFolders', morph);
    }

    async function updateOrder() {
        try {
            await api.folder.reorderFolders({
                folder_ids: folders.value.map(folder => folder.id)
            });
        } catch (error) {
            console.error('Error updating folder order:', error);
            store.dispatch('Folder/fetchFolders', morph);
        }
    }

    function deleteFolder(folderId) {
        spliceById(store.state.Folder[morph].folders, folderId);

        store.commit('FolderEntity/removeByFolderId', folderId);
    }

    return { folders, isLoading, updateOrder, deleteFolder };
}

const FOLDER_MORPH = {
    COMPANY: 'company',
    OBJECT: 'object',
    OFFER: 'offer',
    TASK: 'task'
};

export function useUserFolders(morph) {
    if (morph === FOLDER_MORPH.COMPANY) return useCompanyFolders();
    if (morph === FOLDER_MORPH.OBJECT) return useObjectFolders();
    if (morph === FOLDER_MORPH.OFFER) return useOfferFolders();
    if (morph === FOLDER_MORPH.TASK) return useTaskFolders();
}

export const useCompanyFolders = createSharedComposable(() => {
    return createSharedFolders('company');
});

export const useObjectFolders = createSharedComposable(() => {
    return createSharedFolders('object');
});

export const useOfferFolders = createSharedComposable(() => {
    return createSharedFolders('offer');
});

export const useTaskFolders = createSharedComposable(() => {
    return createSharedFolders('task');
});
