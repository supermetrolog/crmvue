import { computed } from 'vue';
import { useStore } from 'vuex';
import { createSharedComposable } from '@vueuse/core';
import api from '@/api/api.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

function createSharedFolders(category) {
    const store = useStore();

    const isLoading = computed(() => store.state.Folder[category].loading);

    const folders = computed({
        get() {
            return store.state.Folder[category].folders;
        },
        set(value) {
            store.state.Folder[category].folders = value;
        }
    });

    if (!store.state.Folder[category].loaded) {
        store.dispatch('Folder/fetchFolders', category);
    }

    async function updateOrder() {
        try {
            await api.folder.reorderFolders({
                folder_ids: folders.value.map(folder => folder.id)
            });
        } catch (error) {
            console.error('Error updating folder order:', error);
            store.dispatch('Folder/fetchFolders', category);
        }
    }

    function deleteFolder(folderId) {
        spliceById(store.state.Folder[category].folders, folderId);

        store.commit('FolderEntity/removeByFolderId', { folderId, category });
    }

    function clearFolder(folderId) {
        const folderIndex = store.state.Folder[category].folders.findIndex(
            folder => folder.id === folderId
        );
        if (folderIndex !== -1) {
            store.state.Folder[category].folders[folderIndex].entities_count = 0;
        }

        store.commit('FolderEntity/removeByFolderId', { folderId, category });
    }

    return { folders, isLoading, updateOrder, deleteFolder, clearFolder };
}

const FOLDER_MORPH = {
    COMPANY: 'company',
    OBJECT: 'object',
    OFFER: 'offer_mix',
    TASK: 'task',
    REQUEST: 'request'
};

export function useUserFolders(morph) {
    if (morph === FOLDER_MORPH.COMPANY) return useCompanyFolders();
    if (morph === FOLDER_MORPH.OBJECT) return useObjectFolders();
    if (morph === FOLDER_MORPH.OFFER) return useOfferFolders();
    if (morph === FOLDER_MORPH.TASK) return useTaskFolders();
    if (morph === FOLDER_MORPH.REQUEST) return useRequestFolders();
}

export const useCompanyFolders = createSharedComposable(() => {
    return createSharedFolders(FOLDER_MORPH.COMPANY);
});

export const useObjectFolders = createSharedComposable(() => {
    return createSharedFolders(FOLDER_MORPH.OBJECT);
});

export const useOfferFolders = createSharedComposable(() => {
    return createSharedFolders(FOLDER_MORPH.OFFER);
});

export const useTaskFolders = createSharedComposable(() => {
    return createSharedFolders(FOLDER_MORPH.TASK);
});

export const useRequestFolders = createSharedComposable(() => {
    return createSharedFolders(FOLDER_MORPH.REQUEST);
});
