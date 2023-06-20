import { MutationTree } from "vuex";
import { IComplexState } from "./state";
import Complex from "@/entities/Complex";

export enum ComplexMutationTypes {
  SET_COPMLEX = "SET_COPMLEX",
}

export interface IComplexMutations<S = IComplexState> {
  [ComplexMutationTypes.SET_COPMLEX]: (state: S, payload: Object) => void;
}

export const mutations: MutationTree<IComplexState> & IComplexMutations = {
  [ComplexMutationTypes.SET_COPMLEX](state, payload: any) {
    console.log(payload);
    const complex: Complex =new Complex();
    complex.id = payload.id;
    complex.name = payload.title;
    complex.lastUpdatedAt = new Date(payload.last_update).toString();
    complex.createdAt = payload.created_at;
    complex.consultantName = 'MATVEEV';
    state.complex = complex;
  },
};
