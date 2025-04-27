import api from '@/api/api.js';

const FolderEntity = {
    namespaced: true,
    state: {
        company: {
            loading: false,
            loaded: false,
            entities: [],
            needsUpdate: false
        }
    },
    mutations: {
        removeByFolderId(state, folderId) {
            const oldEntitiesLength = state.company.entities.length;

            state.company.entities = state.company.entities.filter(
                entity => entity.folder_id !== folderId
            );

            if (oldEntitiesLength !== state.company.entities.length) {
                state.company.needsUpdate = true;
            }
        }
    },
    actions: {
        async fetchEntities({ state }, category) {
            if (state[category].loading) return;

            try {
                state[category].loading = true;

                const response = await api.folder.searchEntities({ category });

                state[category].entities = response.data;

                state[category].loaded = true;
            } catch (error) {
                console.error('Error fetching entity folders:', error);
            } finally {
                state[category].loading = false;
            }
        }
    },
    getters: {}
};

export default FolderEntity;
