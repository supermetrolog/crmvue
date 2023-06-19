import { MutationTree } from "vuex";
import { IComplexObject, IComplexState } from "./state";

export enum ComplexMutationTypes {
  SET_COPMLEX_OBJECTS = "SET_COPMLEX_OBJECTS",
}

export interface IComplexMutations<S = IComplexState> {
  [ComplexMutationTypes.SET_COPMLEX_OBJECTS]: (
    state: S,
    payload: IComplexObject[]
  ) => void;
}

export const mutations: MutationTree<IComplexState> & IComplexMutations = {
  [ComplexMutationTypes.SET_COPMLEX_OBJECTS](state, payload) {
    state.complexObjects = payload;
  },
};
