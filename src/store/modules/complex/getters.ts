import { GetterTree } from "vuex";
import { IComplexState } from "./state";
import IComplex from "@/interfaces/IComplex";

export enum ComplexGettersTypes {
  COMPLEX = "COMPLEX",
}

export interface IComplexGetters<S = IComplexState> {
  [ComplexGettersTypes.COMPLEX]: (state: S) => IComplex | null;
}

export const getters: GetterTree<IComplexState, IComplexState> &
  IComplexGetters = {
  [ComplexGettersTypes.COMPLEX](state) {
    return state.complex;
  },
};
