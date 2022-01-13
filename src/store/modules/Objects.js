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
        resetCurrentStepObjects(state) {
            state.currentStepObjects = [];
            state.allObjects = [];
        }
    },
    actions: {
        async FETCH_CURRENT_STEP_OBJECTS({ commit }, currentObjects) {
            console.error("BEFORE", currentObjects);
            let array = [];
            currentObjects.map((item) => {
                array.push(item.offer_id)
            });
            // const objects = await api.objects.getCurrentStepObjects(array);
            const objects = await api.objects.getCurrentStepObjectsOneByOne(currentObjects);
            console.error("MIDDLE", objects);

            array = [];
            currentObjects.map((item) => {
                objects.map((object) => {
                    if (item.object_id == object.original_id) {
                        object.duplicate_count = item.duplicate_count;
                        object.comment = item.comment;
                        array.push(object);
                    }
                })
            });
            commit('updateCurrentStepObjects', array);
            console.error("AFTER", array);
            return array;

        },
        async FETCH_OBJECTS_FOR_PREVENT_STEP_OBJECTS(context, currentStepNumber) {
            const preventStepObjects = context.getters.TIMELINE.timelineSteps[currentStepNumber - 1].timelineStepObjects;
            const currentStepObjects = context.getters.TIMELINE.timelineSteps[currentStepNumber].timelineStepObjects;

            let array = [];
            preventStepObjects.map((item) => {
                array.push(item.offer_id)
            });
            // const objects = await api.objects.getCurrentStepObjects(array);
            const objects = await api.objects.getCurrentStepObjectsOneByOne(preventStepObjects);
            array = [];
            let currentStepObject = null;
            preventStepObjects.map((item) => {
                objects.map((object) => {
                    if (item.object_id == object.original_id) {
                        currentStepObject = currentStepObjects.find(currentObject => currentObject.offer_id == item.offer_id);
                        if (currentStepObject) {
                            object.comment = currentStepObject.comment;
                        }
                        array.push(object);
                    }
                })
            });
            context.commit('updateAllObjectForPreventStep', array);
            return array;
        },
        async FETCH_ALL_OBJECTS(context, currentStepNumber) {
            let objects = [];
            if (currentStepNumber == 1) {
                objects = await api.objects.getAllObjects(context.getters.OBJECTS_CURRENT_PAGE);
                context.commit('updateAllObjects', objects);

                return objects;
            } else {
                if (currentStepNumber != 0) {
                    return await context.dispatch('FETCH_OBJECTS_FOR_PREVENT_STEP_OBJECTS', currentStepNumber);
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
        RESET_CURRENT_STEP_OBJECTS(context) {
            context.commit('resetCurrentStepObjects');
        }
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