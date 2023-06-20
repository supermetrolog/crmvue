import { ActionContext, ActionTree } from "vuex";
import { IComplexState } from "./state";
import { ComplexMutationTypes } from "./mutations";
import api from "@/api/api";

export enum ComplexActionTypes {
  FETCH_COMPLEX = "FETCH_COMPLEX",
}

export interface IComplexActions<S = IComplexState> {
  [ComplexActionTypes.FETCH_COMPLEX]: (
    context: ActionContext<S, S>,
    payload: {
      complexId: number;
    }
  ) => void;
}

export const actions: ActionTree<IComplexState, IComplexState> &
  IComplexActions = {
  async [ComplexActionTypes.FETCH_COMPLEX](context, payload) {
    const response = await api.complex.getComplexWithObjects(
      payload.complexId.toString()
    );
    if (response) {
      context.commit(ComplexMutationTypes.SET_COPMLEX, response.data);
    }
    return response;
  },
};
