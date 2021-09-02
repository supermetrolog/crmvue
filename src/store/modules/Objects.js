// import axios from "axios"
import api from "@/api/api"
const Objects = {
    state: {
        currentStepObjects: [],
        allObjects: []
    },
    mutations: {
        updateCurrentStepObjects(state, objects) {
            state.currentStepObjects = objects;
        },
        updateAllObjects(state, objects) {
            state.allObjects = objects;
        }
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
            if (!context.getters.ALL_OBJECTS.length) {
                const objects = await api.objects.getAllObjects();
                console.log("asdjkas", objects);
                context.commit('updateAllObjects', objects.offers);
            }
        }
    },
    getters: {
        CURRENT_STEP_OBJECTS(state) {
            return state.currentStepObjects;
        },
        ALL_OBJECTS(state) {
            return state.allObjects;
        }
    }
}

export default Objects;