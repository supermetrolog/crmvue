import {MutationTree} from "vuex";
import {IComplexState} from "./state";
import ComplexEntity from "@/entities/complex.entity";
import ObjectEntity from "@/entities/objects.entity";

export enum ComplexMutationTypes {
	SET_COPMLEX = "SET_COPMLEX",
}

export interface IComplexMutations<S = IComplexState> {
	[ComplexMutationTypes.SET_COPMLEX]: (state: S, payload: Object) => void;
}

export const mutations: MutationTree<IComplexState> & IComplexMutations = {
	[ComplexMutationTypes.SET_COPMLEX](state, payload: any) {
		const complex = new ComplexEntity();
		const objects = payload.objects.map((el: Record<string, any>) => {
			const object = new ObjectEntity();
			object.load(el);
			return object
		});
		complex.load({
			...payload,
			managment_company_value: null,
			objects,
			...payload.location,
		});
		state.complex = complex;
	},
};
