import { MutationTree } from "vuex";
import { IComplex, IComplexState } from "./state";

export enum ComplexMutationTypes {
  SET_COPMLEX = "SET_COPMLEX",
}

export interface IComplexMutations<S = IComplexState> {
  [ComplexMutationTypes.SET_COPMLEX]: (state: S, payload: IComplex) => void;
}

export const mutations: MutationTree<IComplexState> & IComplexMutations = {
  [ComplexMutationTypes.SET_COPMLEX](state, payload) {
    state.complex = payload;
  },
};
