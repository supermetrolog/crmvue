import api from '@/api/api.js';

const Folder = {
    namespaced: true,
    state: {
        company: {
            loading: false,
            loaded: false,
            folders: []
        },
        offer_mix: {
            loading: false,
            loaded: false,
            folders: []
        },
        task: {
            loading: false,
            loaded: false,
            folders: []
        },
        request: {
            loading: false,
            loaded: false,
            folders: []
        }
    },
    mutations: {},
    actions: {
        async fetchFolders({ state }, morph) {
            if (state[morph].loading) return;

            try {
                state[morph].loading = true;

                const response = await api.folder.search({
                    category: morph
                });

                state[morph].folders = response.data;

                state[morph].loaded = true;
            } catch (error) {
                console.error('Error fetching folders:', error);
            } finally {
                state[morph].loading = false;
            }
        }
    },
    getters: {}
};

export default Folder;
