import { GetterTree } from "vuex";
import { IComplexObject, IComplexState } from "./state";

export interface IComplexGetters<S = IComplexState> {
  complexObjects: (state: S) => IComplexObject[];
}

export const getters: GetterTree<IComplexState, IComplexState> &
  IComplexGetters = {
  complexObjects(state) {
    return state.complexObjects;
  },
};
