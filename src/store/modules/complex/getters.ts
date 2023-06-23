import { GetterTree } from "vuex";
import { IComplexState } from "./state";
import ComplexInterface from "@/interfaces/complex.interface";

export interface IComplexGetters<S = IComplexState> {
  complex: (state: S) => ComplexInterface | null;
}

export const getters: GetterTree<IComplexState, IComplexState> &
  IComplexGetters = {
  complex(state) {
    return state.complex;
  },
};
