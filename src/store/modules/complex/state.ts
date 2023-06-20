export interface IComplexState {
  complex: IComplex | null;
}

export interface IComplex extends Record<string, any> {}

export const state: IComplexState = {
  complex: null,
};
