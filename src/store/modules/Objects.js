// import axios from "axios"
import api from "@/api/api"
const Objects = {
    state: {
        currentStepObjects: [],
        allObjects: [],
        objectPagination: null,
        objectsCurrentPage: 1,
    },
    mutations: {
        updateCurrentStepObjects(state, objects) {
            state.currentStepObjects = objects;
        },
        updateAllObjects(state, data) {
            if (Array.isArray(state.allObjects) || Array.isArray(data.offers)) {
                state.allObjects = state.allObjects.concat(data.offers);

            } else {
                state.allObjects = data.offers;
            }
            state.objectPagination = data.pagination;
        },
        incrimentCurrentPage(state) {
            state.objectsCurrentPage++;
        },
        returnCurrentPageToFirst(state) {
            state.objectsCurrentPage = 1;
            state.allObjects = [];
        },
    },
    actions: {
        async FETCH_CURRENT_STEP_OBJECTS({ commit }, currentObjects) {
            let array = [];
            for (const key in currentObjects) {
                if (Object.hasOwnProperty.call(currentObjects, key)) {
                    const object = currentObjects[key];
                    array.push(await api.objects.getCurrentStepObjects(object));
                }
            }
            // console.error(array);
            commit('updateCurrentStepObjects', array);
        },
        async FETCH_ALL_OBJECTS(context) {
            const objects = await api.objects.getAllObjects(context.getters.OBJECTS_CURRENT_PAGE);
            context.commit('updateAllObjects', objects);
        },
        async SEND_OBJECTS(context, step_id, objects) {
            await api.objects.sendObjects(step_id, objects);
        },
        INCRIMENT_OBJECTS_CURRENT_PAGE(context) {
            context.commit('incrimentCurrentPage');
        },
        RETURN_OBJECTS_CURRENT_PAGE_TO_FIRST(context) {
            context.commit('returnCurrentPageToFirst');
        },
    },
    getters: {
        CURRENT_STEP_OBJECTS(state) {
            return state.currentStepObjects;
        },
        ALL_OBJECTS(state) {
            return state.allObjects;
        },
        OBJECTS_CURRENT_PAGE(state) {
            return state.objectsCurrentPage;
        },
        OBJECTS_PAGINATION(state) {
            return state.objectPagination;
        },
    }
}

export default Objects;