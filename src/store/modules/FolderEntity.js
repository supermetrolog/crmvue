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
        async fetchEntities({ state }, morph) {
            if (state[morph].loading) return;

            try {
                state[morph].loading = true;

                const response = await api.folder.searchEntities({
                    morph: morph
                });

                state[morph].entities = response.data;

                state[morph].loaded = true;
            } catch (error) {
                console.error('Error fetching entity folders:', error);
            } finally {
                state[morph].loading = false;
            }
        }
    },
    getters: {}
};

export default FolderEntity;
