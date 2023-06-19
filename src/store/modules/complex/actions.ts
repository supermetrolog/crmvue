import { ActionContext, ActionTree } from "vuex";
import { IComplexState } from "./state";
import { ComplexMutationTypes } from "./mutations";
import api from "@/api/api";

export enum ComplexActionTypes {
  FETCH_COMPLEX_OBJECTS = "FETCH_COMPLEX_OBJECTS",
}

export interface IComplexActions<S = IComplexState> {
  [ComplexActionTypes.FETCH_COMPLEX_OBJECTS]: (
    context: ActionContext<S, S>,
    payload: {
      complexId: number;
    }
  ) => void;
}

export const actions: ActionTree<IComplexState, IComplexState> &
  IComplexActions = {
  async [ComplexActionTypes.FETCH_COMPLEX_OBJECTS](context, payload) {
    const response = await api.complexObjects.getComplexObjects(
      payload.complexId.toString()
    );
    if (response) {
      context.commit(ComplexMutationTypes.SET_COPMLEX_OBJECTS, response.data);
    }
    return response;
  },
};
