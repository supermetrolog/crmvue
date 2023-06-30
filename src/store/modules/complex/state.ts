import IComplex from "@/interfaces/complex.interface";

export interface IComplexState {
  complex: IComplex | null;
}

export const state: IComplexState = {
  complex: null,
};
