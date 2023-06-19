import { GetterTree } from "vuex";
import { IComplexObject, IComplexState } from "./state";

export enum ComplexGettersTypes {
  COMPLEX_OBJECTS = "COMPLEX_OBJECTS",
}

export interface IComplexGetters<S = IComplexState> {
  [ComplexGettersTypes.COMPLEX_OBJECTS]: (state: S) => IComplexObject[];
}

export const getters: GetterTree<IComplexState, IComplexState> &
  IComplexGetters = {
  [ComplexGettersTypes.COMPLEX_OBJECTS](state) {
    return state.complexObjects;
  },
};
