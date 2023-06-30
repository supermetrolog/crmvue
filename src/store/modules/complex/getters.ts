import { GetterTree } from "vuex";
import { IComplexState } from "./state";
import IComplex from "@/interfaces/complex.interface";

export interface IComplexGetters<S = IComplexState> {
  complex: (state: S) => IComplex | null;
}

export const getters: GetterTree<IComplexState, IComplexState> &
  IComplexGetters = {
  complex(state) {
    return state.complex;
  },
};
