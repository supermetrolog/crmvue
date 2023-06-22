import { GetterTree } from "vuex";
import { IComplexState } from "./state";
import ComplexInterface from "@/interfaces/complex.interface";

export enum ComplexGettersTypes {
  COMPLEX = "COMPLEX",
}

export interface IComplexGetters<S = IComplexState> {
  [ComplexGettersTypes.COMPLEX]: (state: S) => ComplexInterface | null;
}

export const getters: GetterTree<IComplexState, IComplexState> &
  IComplexGetters = {
  [ComplexGettersTypes.COMPLEX](state) {
    return state.complex;
  },
};
