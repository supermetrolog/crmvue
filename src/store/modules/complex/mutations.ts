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
		const splittedAddress = payload.address.split(', ');
		const complex = new ComplexEntity();
		const objects = payload.objects.map((el: Record<string, any>) => {
			const object = new ObjectEntity();
			object.load(el);
			return object
		});
		complex.load({
			...payload,
			consultant_name: "Иванов Иван",
			managment_company_value: null,
			region: splittedAddress[1],
			district: splittedAddress[2],
			locality: splittedAddress[3],
			highway: splittedAddress[4],
			heating_autonomous_type: "Газовое",
			water_type: ["Скважина", "Центральное"],
			entrance_type: payload.entrance_type ? "Платный" : "Бесплатный",
			internet_type: ["Опто-волокно"],
			guard_type: ["ЧОП"],
			objects
		});
		state.complex = complex;
	},
};
