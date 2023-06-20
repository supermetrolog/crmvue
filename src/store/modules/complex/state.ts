import IComplex from "@/interfaces/IComplex";

export interface IComplexState {
  complex: IComplex | null;
}

export const state: IComplexState = {
  complex: null,
};
