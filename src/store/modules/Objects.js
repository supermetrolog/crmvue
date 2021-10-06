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
            if (Array.isArray(state.allObjects) && Array.isArray(data.offers) && state.objectsCurrentPage > 1) {
                state.allObjects = state.allObjects.concat(data.offers);

            } else {
                state.allObjects = data.offers;
            }
            state.objectPagination = data.pagination;
        },
        updateAllObjectForPreventStep(state, objects) {
            state.allObjects = objects;
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
            currentObjects.map((item) => {
                array.push(item.offer_id)
            });
            const objects = await api.objects.getCurrentStepObjects(array);
            array = [];
            currentObjects.map((item) => {
                objects.map((object) => {
                    if (item.offer_id == object.id) {
                        object.duplicate_count = item.duplicate_count;
                        array.push(object);
                    }
                })
            });
            console.log(array);
            commit('updateCurrentStepObjects', array);
        },
        async FETCH_OBJECTS_FOR_PREVENT_STEP_OBJECTS(context, currentStepNumber) {
            const preventStepObjects = context.getters.TIMELINE.timelineSteps[currentStepNumber - 1].timelineStepObjects;

            let array = [];
            preventStepObjects.map((item) => {
                array.push(item.offer_id)
            });
            const objects = await api.objects.getCurrentStepObjects(array);
            array = [];
            preventStepObjects.map((item) => {
                objects.map((object) => {
                    if (item.offer_id == object.id) {
                        // object.duplicate_count = item.duplicate_count;
                        array.push(object);
                    }
                })
            });
            context.commit('updateAllObjectForPreventStep', array);
        },
        async FETCH_ALL_OBJECTS(context, currentStepNumber) {
            let objects = [];
            if (currentStepNumber == 1) {
                objects = await api.objects.getAllObjects(context.getters.OBJECTS_CURRENT_PAGE);
                context.commit('updateAllObjects', objects);

            } else {
                if (currentStepNumber != 0) {
                    await context.dispatch('FETCH_OBJECTS_FOR_PREVENT_STEP_OBJECTS', currentStepNumber);

                }
            }
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