import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { createSharedComposable } from '@vueuse/core';
import { useUserFolders } from '@/composables/useUserFolders.js';
import api from '@/api/api.js';

function createEntityFolderMap(entities) {
    const map = new Map();

    for (const entity of entities) {
        if (map.has(entity.entity_id)) {
            map.get(entity.entity_id).add(entity.folder_id);
        } else {
            map.set(entity.entity_id, new Set([entity.folder_id]));
        }
    }

    return map;
}

function createSharedFolderEntities(morph) {
    const store = useStore();

    const isLoading = computed(() => store.state.FolderEntity[morph].loading);

    const entityFolderMap = ref(new Map());

    if (store.state.FolderEntity[morph].loaded) {
        entityFolderMap.value = createEntityFolderMap(store.state.FolderEntity[morph].entities);
    } else {
        store.dispatch('FolderEntity/fetchEntities', morph).then(() => {
            entityFolderMap.value = createEntityFolderMap(store.state.FolderEntity[morph].entities);
        });
    }

    watch(
        () => store.state.FolderEntity[morph].needsUpdate,
        value => {
            if (value) {
                entityFolderMap.value = createEntityFolderMap(
                    store.state.FolderEntity[morph].entities
                );
                store.state.FolderEntity[morph].needsUpdate = false;
            }
        }
    );

    async function addEntityToFolder(folderId, entityId) {
        if (entityFolderMap.value.has(entityId)) {
            entityFolderMap.value.get(entityId).add(folderId);
        } else {
            entityFolderMap.value.set(entityId, new Set([folderId]));
        }

        const folderIndex = store.state.Folder[morph].folders.findIndex(
            folder => folder.id === folderId
        );

        if (folderIndex !== -1) {
            store.state.Folder[morph].folders[folderIndex].entities_count =
                (store.state.Folder[morph].folders[folderIndex].entities_count ?? 0) + 1;
        }

        try {
            await api.folder.addEntities(folderId, {
                entities: [{ entity_id: entityId, entity_type: morph }]
            });

            store.state.FolderEntity[morph].entities.push({
                entity_id: entityId,
                folder_id: folderId
            });
        } catch (error) {
            console.error('Error adding entity to folder:', error);

            entityFolderMap.value.get(entityId).delete(folderId);

            if (folderIndex !== -1) {
                store.state.Folder[morph].folders[folderIndex].entities_count--;
            }
        }
    }

    async function removeEntityFromFolder(folderId, entityId) {
        entityFolderMap.value.get(entityId).delete(folderId);

        const folderIndex = store.state.Folder[morph].folders.findIndex(
            folder => folder.id === folderId
        );

        if (folderIndex !== -1) {
            store.state.Folder[morph].folders[folderIndex].entities_count--;
        }

        try {
            await api.folder.removeEntities(folderId, {
                entities: [{ entity_id: entityId, entity_type: morph }]
            });

            const entityIndex = store.state.FolderEntity[morph].entities.findIndex(
                entity => entity.entity_id === entityId && entity.folder_id === folderId
            );
            if (entityIndex !== -1) store.state.FolderEntity[morph].entities.splice(entityIndex);
        } catch (error) {
            console.error('Error removing entity from folder:', error);

            entityFolderMap.value.get(entityId).add(folderId);

            if (folderIndex !== -1) {
                store.state.Folder[morph].folders[folderIndex].entities_count =
                    (store.state.Folder[morph].folders[folderIndex].entities_count ?? 0) + 1;
            }
        }
    }

    return { entityFolderMap, isLoading, addEntityToFolder, removeEntityFromFolder };
}

const FOLDER_MORPH = {
    COMPANY: 'company',
    OBJECT: 'object',
    OFFER: 'offer_mix',
    TASK: 'task'
};

function useSharedUserFolderEntitiesByMorph(morph) {
    if (morph === FOLDER_MORPH.COMPANY) return useCompanyFolderEntities();
    if (morph === FOLDER_MORPH.OBJECT) return useObjectFolderEntities();
    if (morph === FOLDER_MORPH.OFFER) return useOfferFolderEntities();
    if (morph === FOLDER_MORPH.TASK) return useTaskFolderEntities();
}

export function useUserFolderEntities(morph, entityId) {
    const { folders, isLoading: foldersIsLoading } = useUserFolders(morph);

    let {
        entityFolderMap,
        isLoading: entitiesIsLoading,
        addEntityToFolder,
        removeEntityFromFolder
    } = useSharedUserFolderEntitiesByMorph(morph);

    const isLoading = computed(() => foldersIsLoading.value || entitiesIsLoading.value);

    const entityHasFolder = computed(() => entityFolderMap.value.has(entityId));

    const entityFoldersCount = computed(() => {
        if (entityHasFolder.value) {
            return entityFolderMap.value.get(entityId).size;
        }

        return 0;
    });

    const entityFoldersSet = computed(() => {
        if (entityHasFolder.value) {
            return entityFolderMap.value.get(entityId);
        }

        return new Set();
    });

    const entityFolders = computed(() => {
        if (entityHasFolder.value) {
            return Array.from(entityFolderMap.value.get(entityId));
        }

        return [];
    });

    async function addToFolder(folderId) {
        return await addEntityToFolder(folderId, entityId);
    }

    async function removeFromFolder(folderId) {
        return await removeEntityFromFolder(folderId, entityId);
    }

    return {
        isLoading,
        folders,
        entityHasFolder,
        entityFoldersCount,
        entityFolders,
        entityFoldersSet,
        addToFolder,
        removeFromFolder
    };
}

export const useCompanyFolderEntities = createSharedComposable(() => {
    return createSharedFolderEntities(FOLDER_MORPH.COMPANY);
});

export const useObjectFolderEntities = createSharedComposable(() => {
    return createSharedFolderEntities(FOLDER_MORPH.OBJECT);
});

export const useOfferFolderEntities = createSharedComposable(() => {
    return createSharedFolderEntities(FOLDER_MORPH.OFFER);
});

export const useTaskFolderEntities = createSharedComposable(() => {
    return createSharedFolderEntities(FOLDER_MORPH.TASK);
});
